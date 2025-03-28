class MockFirebaseService:
    """Mock Firebase service for when real Firebase isn't available"""
    def __init__(self):
        self.initialized = False
        self.local_storage = {'conversations': {}, 'complaints': {}}
        print("🔶 Using mock Firebase service")

    def get_conversation_history(self, conversation_id):
        """Return empty conversation history"""
        return []
        
    def add_to_conversation(self, conversation_id, user_message, ai_response, sources=None):
        """Mock adding to conversation"""
        return True
        
    def get_conversation_title(self, conversation_id):
        """Return mock title"""
        return "Mock Conversation"
        
    def update_conversation_title(self, conversation_id, title):
        """Mock update title"""
        return True
        
    def get_all_conversations(self):
        """Return empty conversations list"""
        return []
        
    def create_conversation(self, title="New Conversation"):
        """Return mock conversation ID"""
        return "mock-conversation-id"
        
    def get_all_tickets(self):
        """Return mock tickets"""
        return [
            {
                "ticket_id": "17428378321",
                "message": "I would like to file a complaint about my bus service.",
                "intent": "Complaint",
                "urgency": "Medium",
                "status": "Open",
                "created_at": "2025-03-24T12:00:00",
                "user_name": "Test User",
                "user_email": "test@example.com",
                "order_id": "123"
            },
            {
                "ticket_id": "17428378322",
                "message": "The bus was late by 30 minutes",
                "intent": "Complaint",
                "urgency": "High",
                "status": "Open",
                "created_at": "2025-03-24T12:30:00",
                "user_name": "John Smith",
                "user_email": "john@example.com",
                "order_id": "456"
            }
        ]
        
    def log_complaint(self, user_id, user_message, intent, urgency, order_id=None, user_name=None, user_email=None):
        """Log mock complaint"""
        return "mock-ticket-id"

class MockChromaService:
    """Mock ChromaDB service"""
    def __init__(self, collection_name=None, persist_directory=None, openai_api_key=None):
        pass
        
    def query(self, query_text, n_results=5):
        """Return empty query results"""
        return []
        
    def get_sources(self):
        """Return empty sources list"""
        return []
        
    def add(self, texts, embeddings, metadatas, ids):
        """Mock add function"""
        pass
        
    def delete_source(self, source_name):
        """Mock delete function"""
        return True

class MockLLMService:
    """Mock LLM service"""
    def __init__(self, api_key, firebase_service):
        self.firebase = firebase_service
        
    def classify_issue(self, user_message):
        """Return mock classification"""
        return "General Inquiry", "Low"
        
    def generate_response(self, user_id, user_message, conversation_history=None, context=None, conversation_id=None, user_data=None):
        """Return mock response"""
        return {
            "message": f"Mock response to: {user_message}",
            "sources": []
        }
        
    def extract_user_details(self, message):
        """Return mock user details"""
        return {"order_id": None, "user_name": None, "user_email": None}
        
    def generate_conversation_title(self, user_message):
        """Return mock title"""
        return "Mock Conversation"

class MockEmbeddingService:
    """Mock embedding service"""
    def __init__(self, api_key):
        pass
        
    def generate(self, text):
        """Return mock embedding"""
        return [0.0] * 1536  # Return a mock 1536-dim vector

class MockTextProcessor:
    """Mock text processor"""
    def __init__(self, chunk_size=1000, chunk_overlap=200):
        pass
        
    def process_file(self, file_path):
        """Return mock chunks"""
        return ["Mock text chunk"]

class ServiceManager:
    """Mock service manager for when real services aren't available"""
    def __init__(self):
        self.firebase_service = MockFirebaseService()
        self.chroma_service = MockChromaService()
        self.llm_service = MockLLMService(api_key=None, firebase_service=self.firebase_service)
        self.embedding_service = MockEmbeddingService(api_key=None)
        self.text_processor = MockTextProcessor()
        
    def init_app(self, app):
        """Initialize with app context"""
        app.services = self
        print("🔶 Mock service manager initialized")

# Create a mock service manager instance
mock_service_manager = ServiceManager()