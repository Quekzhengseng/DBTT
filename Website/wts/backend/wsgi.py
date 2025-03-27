from app import create_app
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Create Flask application for WSGI servers (like Gunicorn)
app = create_app()
logger.info("Flask app created successfully")

if __name__ == "__main__":
    logger.info("Starting Flask development server")
    app.run(host='0.0.0.0', port=5001, debug=True)