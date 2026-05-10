from flask import Blueprint, request, jsonify
from app.extensions import db, bcrypt
from app.models.api_key import ApiKey
from app.models.user import User
from flask_jwt_extended import jwt_required, get_jwt_identity
import secrets

keys_bp = Blueprint('keys', __name__, url_prefix='/api/v1/keys')

@keys_bp.route('/', methods=['GET'])
@jwt_required()
def list_keys():
    user_id = get_jwt_identity()
    keys = ApiKey.query.filter_by(user_id=user_id, is_active=True).all()
    return jsonify([{
        "id": k.id,
        "key_prefix": k.key_prefix,
        "label": k.label,
        "created_at": k.created_at.isoformat() if k.created_at else None,
        "last_used": k.last_used.isoformat() if k.last_used else None
    } for k in keys]), 200

@keys_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_key():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json() or {}
    label = data.get('label', 'Default Key')

    active_keys_count = ApiKey.query.filter_by(user_id=user_id, is_active=True).count()
    limit = 10 if user.plan == 'pro' else 2

    if active_keys_count >= limit:
        return jsonify({"error": f"Key limit reached ({limit} keys max)", "code": "LIMIT_REACHED"}), 403

    raw_key = "sk-sys-" + secrets.token_hex(16)
    key_prefix = raw_key[:16]
    key_hash = bcrypt.generate_password_hash(raw_key).decode('utf-8')

    new_key = ApiKey(
        user_id=user_id,
        key_hash=key_hash,
        key_prefix=key_prefix,
        label=label
    )

    db.session.add(new_key)
    db.session.commit()

    return jsonify({
        "key": raw_key,
        "key_prefix": key_prefix,
        "id": new_key.id,
        "warning": "Save this key. It will not be shown again."
    }), 201

@keys_bp.route('/<key_id>', methods=['DELETE'])
@jwt_required()
def revoke_key(key_id):
    user_id = get_jwt_identity()
    key = ApiKey.query.filter_by(id=key_id, user_id=user_id).first()

    if not key:
        return jsonify({"error": "Key not found", "code": "NOT_FOUND"}), 404

    key.is_active = False
    db.session.commit()

    return jsonify({"revoked": True}), 200
