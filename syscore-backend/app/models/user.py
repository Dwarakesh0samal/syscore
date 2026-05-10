import uuid
from datetime import datetime
from app.extensions import db

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(255), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    display_name = db.Column(db.String(120))
    bio = db.Column(db.Text, nullable=True)
    password_hash = db.Column(db.String(255))
    plan = db.Column(db.String(20), default='free')
    avatar_url = db.Column(db.String(500), nullable=True)
    stripe_customer_id = db.Column(db.String(255), nullable=True)
    stripe_sub_id = db.Column(db.String(255), nullable=True)
    plan_expires_at = db.Column(db.DateTime, nullable=True)
    billing_cycle = db.Column(db.String(20), nullable=True)
    components_accessed_this_month = db.Column(db.Integer, default=0)
    last_reset_date = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    api_keys = db.relationship('ApiKey', backref='user', lazy=True, cascade="all, delete-orphan")
    subscriptions = db.relationship('Subscription', backref='user', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'display_name': self.display_name,
            'bio': self.bio,
            'plan': self.plan,
            'avatar_url': self.avatar_url,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
