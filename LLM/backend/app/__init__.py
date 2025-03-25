# from flask import Flask
# from flask_cors import CORS
# from .config import config_by_name
# import os
# from .routes import chat_bp, files_bp, issues_bp
# from .services import service_manager

# def create_app(config_name=None):
#     """Create and configure the Flask application"""
    
#     # If no config provided, use environment variable or default to development
#     if not config_name:
#         config_name = os.getenv('FLASK_ENV', 'development')
    
#     # Initialize Flask app
#     app = Flask(__name__)
    
#     # Load configuration
#     app.config.from_object(config_by_name[config_name])
    
#     # Enable CORS
#     CORS(app)
    
#     # Ensure upload directory exists
#     upload_dir = app.config.get('UPLOAD_FOLDER', './data/uploads')
#     os.makedirs(upload_dir, exist_ok=True)
    
#     # Ensure ChromaDB directory exists
#     chroma_dir = app.config.get('CHROMA_DB_PATH', './data/chroma')
#     os.makedirs(chroma_dir, exist_ok=True)
    
#     # Initialize services
#     from .services import service_manager
#     service_manager.init_app(app)
    
#     # Register blueprints
#     from .routes.chat import chat_bp
#     from .routes.files import files_bp
#     from .routes.issues import issues_bp
    
#     app.register_blueprint(chat_bp, url_prefix='/api/chat')
#     app.register_blueprint(files_bp, url_prefix='/api/files')
#     app.register_blueprint(issues_bp, url_prefix='/api/issues')
    
#     # Register error handlers
#     from .utils.error_handlers import register_error_handlers
#     register_error_handlers(app)
    
#     return app

from flask import Flask
from flask_cors import CORS
from .config import config_by_name
import os
import logging
import importlib.util

def create_app(config_name=None):
    """Create and configure the Flask application"""
    
    # If no config provided, use environment variable or default to development
    if not config_name:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    # Initialize Flask app
    app = Flask(__name__)
    
    # Set up logging
    logging.basicConfig(level=logging.DEBUG)
    app.logger.setLevel(logging.DEBUG)
    
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
    
    # Check if chromadb is installed
    chromadb_installed = importlib.util.find_spec("chromadb") is not None
    app.config['CHROMADB_AVAILABLE'] = chromadb_installed
    
    # Check if firebase_admin is installed
    firebase_installed = importlib.util.find_spec("firebase_admin") is not None
    app.config['FIREBASE_AVAILABLE'] = firebase_installed
    
    # Initialize services with available dependencies
    try:
        from .services import service_manager
        service_manager.init_app(app)
    except ImportError as e:
        app.logger.error(f"Service initialization error: {e}")
        app.logger.warning("Some services may not be available due to missing dependencies")
    
    # Register blueprints
    from .routes.chat import chat_bp
    from .routes.files import files_bp
    from .routes.issues import issues_bp
    from .routes.test_issues import test_issues_bp
    
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    app.register_blueprint(files_bp, url_prefix='/api/files')
    app.register_blueprint(issues_bp, url_prefix='/api/issues')
    app.register_blueprint(test_issues_bp, url_prefix='/api/test-issues')
    
    # Add basic health endpoint directly to app
    @app.route('/health', methods=['GET'])
    def health_check():
        """Basic health check endpoint outside of any blueprint"""
        return {
            "status": "ok", 
            "message": "API is running",
            "dependencies": {
                "chromadb": app.config.get('CHROMADB_AVAILABLE', False),
                "firebase": app.config.get('FIREBASE_AVAILABLE', False)
            }
        }
    
        # Add a basic root endpoint
    @app.route('/', methods=['GET'])
    def root():
        """Root endpoint to check if the app is running."""
        return jsonify({
            'status': 'ok',
            'message': 'WTS Travel API is running'
        })

    # Add a basic health endpoint
    @app.route('/health', methods=['GET'])
    def health():
        """Health check endpoint."""
        return jsonify({
            'status': 'ok',
            'message': 'API is healthy'
        })
    
    return app