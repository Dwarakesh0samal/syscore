from flask import Blueprint, request, jsonify
from app.extensions import db, limiter
from app.models.waitlist import Waitlist
import re

waitlist_bp = Blueprint('waitlist', __name__, url_prefix='/api/v1/waitlist')

def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

@waitlist_bp.route('/join', methods=['POST'])
@limiter.limit("3 per hour")
def join():
    data = request.get_json()
    email = data.get('email')
    source = data.get('source', 'hero')

    if not email or not is_valid_email(email):
        return jsonify({"error": "Invalid email", "code": "INVALID_EMAIL"}), 400

    existing = Waitlist.query.filter_by(email=email).first()
    if existing:
        return jsonify({"already": True}), 200

    entry = Waitlist(email=email, source=source)
    db.session.add(entry)
    db.session.commit()

    position = Waitlist.query.count()
    return jsonify({"success": True, "position": position}), 201

@waitlist_bp.route('/count', methods=['GET'])
def count():
    n = Waitlist.query.count()
    return jsonify({"count": n}), 200
