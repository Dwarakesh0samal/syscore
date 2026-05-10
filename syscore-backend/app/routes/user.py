from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user import User
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
from werkzeug.utils import secure_filename

user_bp = Blueprint('user', __name__, url_prefix='/api/v1/user')

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@user_bp.route('/profile', methods=['PATCH'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json()

    if 'username' in data and data['username'] != user.username:
        if User.query.filter_by(username=data['username']).first():
            return jsonify({"error": "Username already taken", "code": "USERNAME_EXISTS"}), 400
        user.username = data['username']

    if 'display_name' in data:
        user.display_name = data['display_name']
    
    if 'bio' in data:
        user.bio = data['bio']

    db.session.commit()
    return jsonify(user.to_dict()), 200

@user_bp.route('/avatar', methods=['POST'])
@jwt_required()
def upload_avatar():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if 'avatar' not in request.files:
        return jsonify({"error": "No file part", "code": "NO_FILE"}), 400
    
    file = request.files['avatar']
    if file.filename == '':
        return jsonify({"error": "No selected file", "code": "NO_FILE"}), 400

    if file and allowed_file(file.filename):
        # Check size (max 2MB)
        file.seek(0, os.SEEK_END)
        file_length = file.tell()
        if file_length > 2 * 1024 * 1024:
            return jsonify({"error": "File too large (max 2MB)", "code": "FILE_TOO_LARGE"}), 400
        file.seek(0)

        filename = secure_filename(file.filename)
        ext = filename.rsplit('.', 1)[1].lower()
        new_filename = f"{user_id}.{ext}"
        
        upload_folder = os.path.join('app', 'static', 'avatars')
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
            
        file_path = os.path.join(upload_folder, new_filename)
        file.save(file_path)

        user.avatar_url = f"/static/avatars/{new_filename}"
        db.session.commit()

        return jsonify({"avatar_url": user.avatar_url}), 200

    return jsonify({"error": "Invalid file type", "code": "INVALID_TYPE"}), 400
