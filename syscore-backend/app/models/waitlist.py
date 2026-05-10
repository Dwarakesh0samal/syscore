import uuid
from datetime import datetime
from app.extensions import db

class Waitlist(db.Model):
    __tablename__ = 'waitlist'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(255), unique=True, nullable=False)
    source = db.Column(db.String(80), default='hero')
    converted = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
