from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from config import Config

db = SQLAlchemy()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
    db.init_app(app)

    # Register blueprints
    from app.routes.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()

    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'service': 'acara-backend'}

    return app