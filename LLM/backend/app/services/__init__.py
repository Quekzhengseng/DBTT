# Import service classes
from .chroma_service import ChromaService
from .embedding import EmbeddingService
from .firebase import FirebaseService
from .llm import LLMService
from .text_processor import TextProcessor

class ServiceManager:
    """Manager for initializing and accessing application services."""
    
    def __init__(self, app=None):
        self.chroma_service = None
        self.embedding_service = None
        self.firebase_service = None
        self.llm_service = None
        self.text_processor = None
        
        if app:
            self.init_app(app)
    
    def init_app(self, app):
        """Initialize all services with application config."""
        # Initialize embedding service
        openai_api_key = app.config.get("OPENAI_API_KEY")
        self.embedding_service = EmbeddingService(api_key=openai_api_key)

        # Initialize ChromaDB service
        chroma_db_path = app.config.get("CHROMA_DB_PATH")
        self.chroma_service = ChromaService(
            collection_name="travel_docs", 
            persist_directory=chroma_db_path,
            openai_api_key=openai_api_key  # Pass the API key here
        )
        
        # Initialize Firebase service
        firebase_credentials = app.config.get("FIREBASE_CREDENTIALS")
        self.firebase_service = FirebaseService(credentials_path=firebase_credentials)
        
        # Initialize LLM service
        self.llm_service = LLMService(api_key=openai_api_key, firebase_service=self.firebase_service)
        
        # Initialize text processor
        chunk_size = app.config.get("CHUNK_SIZE", 1000)
        chunk_overlap = app.config.get("CHUNK_OVERLAP", 200)
        self.text_processor = TextProcessor(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        
        # Attach to app
        app.services = self

# Create a global service manager instance
service_manager = ServiceManager()

# Export service classes and the manager
__all__ = [
    'ChromaService',
    'EmbeddingService', 
    'FirebaseService',
    'LLMService',
    'TextProcessor',
    'ServiceManager',
    'service_manager'
]