import stripe
from flask import Blueprint, request, jsonify, current_app
from app.extensions import db
from app.models.user import User
from app.models.subscription import Subscription
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

billing_bp = Blueprint('billing', __name__, url_prefix='/api/v1/billing')

@billing_bp.route('/create-checkout-session', methods=['POST'])
@jwt_required()
def create_checkout_session():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json()
    price_id = data.get('price_id')
    billing_cycle = data.get('billing_cycle', 'monthly')

    stripe.api_key = current_app.config['STRIPE_SECRET_KEY']

    try:
        if not user.stripe_customer_id:
            customer = stripe.Customer.create(
                email=user.email,
                metadata={'user_id': user.id}
            )
            user.stripe_customer_id = customer.id
            db.session.commit()

        checkout_session = stripe.checkout.Session.create(
            customer=user.stripe_customer_id,
            payment_method_types=['card'],
            line_items=[{'price': price_id, 'quantity': 1}],
            mode='subscription',
            success_url=current_app.config['FRONTEND_URL'] + '/settings/billing?success=true',
            cancel_url=current_app.config['FRONTEND_URL'] + '/settings/billing?canceled=true',
            metadata={'user_id': user.id, 'billing_cycle': billing_cycle}
        )
        return jsonify({'checkout_url': checkout_session.url}), 200
    except Exception as e:
        return jsonify({'error': str(e), 'code': 'STRIPE_ERROR'}), 500

@billing_bp.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_data()
    sig_header = request.headers.get('Stripe-Signature')
    endpoint_secret = current_app.config['STRIPE_WEBHOOK_SECRET']

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except Exception as e:
        return jsonify({'error': 'Invalid payload'}), 400

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        handle_checkout_completed(session)
    elif event['type'] == 'customer.subscription.updated':
        subscription = event['data']['object']
        handle_subscription_updated(subscription)
    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        handle_subscription_deleted(subscription)
    elif event['type'] == 'invoice.payment_failed':
        invoice = event['data']['object']
        # TODO: send_payment_failed_email(invoice['customer_email'])

    return jsonify({'success': True}), 200

def handle_checkout_completed(session):
    user_id = session['metadata']['user_id']
    user = User.query.get(user_id)
    user.plan = 'pro'
    user.stripe_sub_id = session['subscription']
    user.billing_cycle = session['metadata']['billing_cycle']
    
    # Update/Create Subscription record
    stripe_sub = stripe.Subscription.retrieve(session['subscription'])
    sub_record = Subscription.query.filter_by(stripe_sub_id=stripe_sub.id).first()
    if not sub_record:
        sub_record = Subscription(
            user_id=user_id,
            stripe_sub_id=stripe_sub.id,
            stripe_customer_id=session['customer'],
            plan='pro',
            billing_cycle=user.billing_cycle,
            status=stripe_sub.status,
            current_period_start=datetime.fromtimestamp(stripe_sub.current_period_start),
            current_period_end=datetime.fromtimestamp(stripe_sub.current_period_end)
        )
        db.session.add(sub_record)
    db.session.commit()

def handle_subscription_updated(stripe_sub):
    sub_record = Subscription.query.filter_by(stripe_sub_id=stripe_sub.id).first()
    if sub_record:
        sub_record.status = stripe_sub.status
        sub_record.current_period_end = datetime.fromtimestamp(stripe_sub.current_period_end)
        if stripe_sub.cancel_at_period_end:
            sub_record.canceled_at = datetime.fromtimestamp(stripe_sub.canceled_at) if stripe_sub.canceled_at else datetime.utcnow()
        db.session.commit()

def handle_subscription_deleted(stripe_sub):
    sub_record = Subscription.query.filter_by(stripe_sub_id=stripe_sub.id).first()
    if sub_record:
        user = User.query.get(sub_record.user_id)
        user.plan = 'free'
        sub_record.status = 'canceled'
        db.session.commit()

@billing_bp.route('/status', methods=['GET'])
@jwt_required()
def get_status():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    sub = Subscription.query.filter_by(user_id=user_id).order_by(Subscription.created_at.desc()).first()
    
    return jsonify({
        "plan": user.plan,
        "billing_cycle": user.billing_cycle,
        "status": sub.status if sub else 'inactive',
        "period_end": sub.current_period_end.isoformat() if sub else None,
        "cancel_at_period_end": sub.canceled_at is not None if sub else False
    }), 200

@billing_bp.route('/create-portal-session', methods=['POST'])
@jwt_required()
def create_portal_session():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    stripe.api_key = current_app.config['STRIPE_SECRET_KEY']

    session = stripe.billing_portal.Session.create(
        customer=user.stripe_customer_id,
        return_url=current_app.config['FRONTEND_URL'] + '/settings/billing'
    )
    return jsonify({'portal_url': session.url}), 200

@billing_bp.route('/cancel', methods=['POST'])
@jwt_required()
def cancel_subscription():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    stripe.api_key = current_app.config['STRIPE_SECRET_KEY']

    try:
        stripe.Subscription.modify(
            user.stripe_sub_id,
            cancel_at_period_end=True
        )
        sub = Subscription.query.filter_by(stripe_sub_id=user.stripe_sub_id).first()
        sub.canceled_at = datetime.utcnow()
        db.session.commit()
        return jsonify({'canceled': True, 'access_until': sub.current_period_end.isoformat()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
