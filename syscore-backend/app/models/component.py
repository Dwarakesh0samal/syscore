from app.extensions import db
from datetime import datetime
import uuid

class Component(db.Model):
    __tablename__ = 'components'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(120), nullable=False)
    slug = db.Column(db.String(120), unique=True, nullable=False)
    category = db.Column(db.String(50), nullable=False)  # Input|Navigation|Card|Overlay|Data
    tier = db.Column(db.String(10), default='free')     # 'free' or 'pro'
    description = db.Column(db.String(500))
    code_html = db.Column(db.Text)                      # actual HTML/CSS
    preview_label = db.Column(db.String(80))            # "[ INPUT.FIELD ]"
    tags = db.Column(db.String(200))                    # comma separated
    copy_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'category': self.category,
            'tier': self.tier,
            'description': self.description,
            'code_html': self.code_html,
            'preview_label': self.preview_label,
            'tags': self.tags,
            'copy_count': self.copy_count,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
