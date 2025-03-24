from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from extensions import db, migrate
from app.routes.auth import auth_bp
from app.routes.borrower import borrower_bp
from app.routes.lender import lender_bp
from app.routes.mediator import mediator_bp
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    JWTManager(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(borrower_bp, url_prefix='/borrower')
    app.register_blueprint(lender_bp, url_prefix='/lender')
    app.register_blueprint(mediator_bp, url_prefix='/mediator')

    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'database': 'PostgreSQL'}

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)

