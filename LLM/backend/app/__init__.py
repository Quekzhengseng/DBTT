from flask import Flask
from flask_cors import CORS
from .config import config_by_name
import os

def create_app(config_name=None):
    """Create and configure the Flask application"""
    
    # If no config provided, use environment variable or default to development
    if not config_name:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    # Initialize Flask app
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config_by_name[config_name])
    
    # Enable CORS
    CORS(app)
    
    # Ensure upload directory exists
    upload_dir = app.config.get('UPLOAD_FOLDER', './data/uploads')
    os.makedirs(upload_dir, exist_ok=True)
    
    # Ensure ChromaDB directory exists
    chroma_dir = app.config.get('CHROMA_DB_PATH', './data/chroma')
    os.makedirs(chroma_dir, exist_ok=True)
    
    # Initialize services
    from .services import service_manager
    service_manager.init_app(app)
    
    # Register blueprints
    from .routes.chat import chat_bp
    from .routes.files import files_bp
    
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    app.register_blueprint(files_bp, url_prefix='/api/files')
    
    # Register error handlers
    from .utils.error_handlers import register_error_handlers
    register_error_handlers(app)
    
    return app