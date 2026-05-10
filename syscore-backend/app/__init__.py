from flask import Flask
from app.config import Config
from app.extensions import db, migrate, jwt, bcrypt, limiter, cors

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    limiter.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": [app.config['FRONTEND_URL'], "https://syscore.io"]}})

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.waitlist import waitlist_bp
    from app.routes.user import user_bp
    from app.routes.keys import keys_bp
    from app.routes.billing import billing_bp
    from app.routes.components import components_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(waitlist_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(keys_bp)
    app.register_blueprint(billing_bp)
    app.register_blueprint(components_bp, url_prefix='/api/v1/components')

    return app
