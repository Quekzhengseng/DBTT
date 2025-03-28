import chromadb
from chromadb.config import Settings
from chromadb.utils.embedding_functions import OpenAIEmbeddingFunction

class ChromaService:
    """Service for interacting with ChromaDB vector database."""
    
    def __init__(self, collection_name, persist_directory, openai_api_key=None):
        """Initialize ChromaDB client and collection."""
        self.client = chromadb.PersistentClient(
            path=persist_directory,
            settings=Settings(anonymized_telemetry=False)
        )
        
        # Set up the OpenAI embedding function if API key is provided
        self.embedding_function = None
        if openai_api_key:
            self.embedding_function = OpenAIEmbeddingFunction(
                api_key=openai_api_key,
                model_name="text-embedding-ada-002"  # Generates 1536-dim vectors
            )
        
        # Get or create collection with the embedding function
        try:
            self.collection = self.client.get_collection(
                name=collection_name,
                embedding_function=self.embedding_function
            )
        except ValueError:
            self.collection = self.client.create_collection(
                name=collection_name,
                embedding_function=self.embedding_function
            )
    
    def add(self, texts, embeddings, metadatas, ids):
        """Add documents with embeddings to the collection."""
        self.collection.add(
            documents=texts,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )
    
    def query(self, query_text, n_results=5):
        """Query the collection for relevant documents."""
        # Ensure query_text is a string
        if query_text is None:
            query_text = ""
        
        # Convert to string if it's not already
        query_text = str(query_text)
        
        try:
            # Check if collection is empty and handle it
            if self.collection.count() == 0:
                print("Warning: ChromaDB collection is empty")
                return []
            
            results = self.collection.query(
                query_texts=[query_text],
                n_results=min(n_results, self.collection.count())
            )
            
            # Format results for easier consumption
            formatted_results = []
            if results and 'documents' in results and len(results['documents']) > 0:
                for i in range(len(results['documents'][0])):
                    formatted_results.append({
                        'text': results['documents'][0][i],
                        'metadata': results['metadatas'][0][i] if 'metadatas' in results and results['metadatas'] else {},
                        'id': results['ids'][0][i] if 'ids' in results and results['ids'] else f"result-{i}",
                        'distance': results.get('distances', [[0]])[0][i] if 'distances' in results and results['distances'] else 0
                    })
            
            return formatted_results
        except Exception as e:
            print(f"Error querying ChromaDB: {e}")
            return []
    
    def get_sources(self):
        """Get a list of all unique source documents."""
        # Get all document metadata
        documents = self.collection.get()
        
        # Extract unique source names
        sources = {}
        if documents and 'metadatas' in documents:
            for metadata in documents['metadatas']:
                source = metadata.get('source')
                if source and source not in sources:
                    sources[source] = {
                        'name': source,
                        'chunks': 1
                    }
                elif source:
                    sources[source]['chunks'] += 1
        
        return list(sources.values())
    
    def delete_source(self, source_name):
        """Delete all chunks from a specific source."""
        # Get all document IDs with matching source
        documents = self.collection.get(
            where={"source": source_name}
        )
        
        if documents and 'ids' in documents and documents['ids']:
            # Delete all documents with matching IDs
            self.collection.delete(
                ids=documents['ids']
            )
            return True
        
        return False