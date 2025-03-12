from app import create_app

# Create Flask application for WSGI servers (like Gunicorn)
app = create_app()

if __name__ == "__main__":
    app.run()