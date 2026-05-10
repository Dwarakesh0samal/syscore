from flask import Blueprint, request, jsonify
from app.extensions import db, bcrypt, limiter
from app.models.user import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import re

auth_bp = Blueprint('auth', __name__, url_prefix='/api/v1/auth')

def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

@auth_bp.route('/register', methods=['POST'])
@limiter.limit("5 per hour")
def register():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    display_name = data.get('display_name')

    if not email or not username or not password:
        return jsonify({"error": "Missing required fields", "code": "MISSING_FIELDS"}), 400

    if not is_valid_email(email):
        return jsonify({"error": "Invalid email format", "code": "INVALID_EMAIL"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered", "code": "EMAIL_EXISTS"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already taken", "code": "USERNAME_EXISTS"}), 400

    password_hash = bcrypt.generate_password_hash(password, rounds=12).decode('utf-8')
    
    user = User(
        email=email,
        username=username,
        password_hash=password_hash,
        display_name=display_name
    )
    
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=user.id)
    return jsonify({
        "access_token": access_token,
        "user": user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
@limiter.limit("10 per hour")
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing email or password", "code": "MISSING_FIELDS"}), 400

    user = User.query.filter_by(email=email).first()
    
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid credentials", "code": "UNAUTHORIZED"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({
        "access_token": access_token,
        "user": user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found", "code": "NOT_FOUND"}), 404
    return jsonify(user.to_dict()), 200
