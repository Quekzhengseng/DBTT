import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Base configuration."""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev_key')
    DEBUG = False
    TESTING = False
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', './data/uploads')
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))  # 16MB
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    CHROMA_DB_PATH = os.getenv('CHROMA_DB_PATH', './data/chroma')
    FIREBASE_CREDENTIALS = os.getenv('FIREBASE_CREDENTIALS')
    CHUNK_SIZE = 1000
    CHUNK_OVERLAP = 200

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True

class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    # Production-specific settings here

# Map environment names to config classes
config_by_name = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig
}