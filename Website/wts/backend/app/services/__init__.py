# Import service classes if available, otherwise use mocks
import importlib.util

# Check if dependencies are available
chromadb_available = importlib.util.find_spec("chromadb") is not None
firebase_available = importlib.util.find_spec("firebase_admin") is not None
openai_available = importlib.util.find_spec("openai") is not None

if all([chromadb_available, firebase_available, openai_available]):
    # Import real services if all dependencies are available
    try:
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
    except ImportError as e:
        print(f"Error importing real services: {e}")
        from .mock_service_manager import mock_service_manager as service_manager
        __all__ = ['service_manager']
else:
    # Import mock services
    print("Some dependencies are missing, using mock services")
    print(f"ChromaDB: {'✅' if chromadb_available else '❌'}")
    print(f"Firebase: {'✅' if firebase_available else '❌'}")
    print(f"OpenAI: {'✅' if openai_available else '❌'}")
    
    from .mock_service_manager import mock_service_manager as service_manager
    __all__ = ['service_manager']