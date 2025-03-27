from app import create_app
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create Flask application instance
app = create_app()

if __name__ == "__main__":
    # Run the app in debug mode during development
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", 5000)),
        debug=os.getenv("FLASK_ENV") == "development"
    )