from flask import Blueprint, request, jsonify
from app.models.component import Component
from app.models.user import User
from app.extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

components_bp = Blueprint('components', __name__)

@components_bp.route('/', methods=['GET'])
def list_components():
    category = request.args.get('category')
    tier = request.args.get('tier')
    search = request.args.get('search')

    query = Component.query

    if category:
        query = query.filter(Component.category == category)
    if tier:
        query = query.filter(Component.tier == tier)
    if search:
        query = query.filter(Component.name.ilike(f'%{search}%'))

    components = query.all()
    
    return jsonify({
        'components': [c.to_dict() for c in components],
        'total': len(components)
    }), 200

@components_bp.route('/<slug>', methods=['GET'])
def get_component(slug):
    component = Component.query.filter_by(slug=slug).first_or_404()
    return jsonify(component.to_dict()), 200

@components_bp.route('/<slug>/copy', methods=['POST'])
@jwt_required()
def track_copy(slug):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    component = Component.query.filter_by(slug=slug).first_or_404()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Monthly reset check
    now = datetime.utcnow()
    if not user.last_reset_date or user.last_reset_date.month != now.month or user.last_reset_date.year != now.year:
        user.components_accessed_this_month = 0
        user.last_reset_date = now

    # Check plan limit for free users
    if user.plan == 'free':
        if user.components_accessed_this_month >= 20:
            return jsonify({
                'error': 'LIMIT_REACHED',
                'limit': 20,
                'upgrade_url': '/billing'
            }), 403

    # Increment counts
    user.components_accessed_this_month += 1
    component.copy_count += 1
    db.session.commit()

    return jsonify({
        'success': True,
        'count': component.copy_count
    }), 200
