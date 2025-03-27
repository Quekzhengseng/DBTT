from openai import OpenAI

class EmbeddingService:
    """Service for generating text embeddings using OpenAI."""
    
    def __init__(self, api_key):
        """Initialize OpenAI client."""
        self.client = OpenAI(api_key=api_key)
        self.model = "text-embedding-ada-002"
    
    def generate(self, text):
        """Generate embedding for the given text."""
        response = self.client.embeddings.create(
            input=text,
            model=self.model
        )
        
        # Extract the embedding vector
        embedding = response.data[0].embedding
        
        return embedding