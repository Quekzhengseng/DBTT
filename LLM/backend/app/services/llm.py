from openai import OpenAI
import json

class LLMService:
    """Service for interacting with OpenAI's language models."""
    
    def __init__(self, api_key):
        """Initialize OpenAI client."""
        self.client = OpenAI(api_key=api_key)
        self.model = "gpt-3.5-turbo"
    
    def generate_response(self, user_message, conversation_history=None, context=None):
        """Generate a response using the language model."""
        # Format conversation history
        messages = []
        
        # System message
        system_message = "You are a helpful travel assistant. "
        
        # Add context if available
        if context and len(context) > 0:
            system_message += "Use the following information to answer the user's question:\n\n"
            for item in context:
                system_message += f"--- From {item['metadata']['source']} ---\n"
                system_message += f"{item['text']}\n\n"
        
        messages.append({"role": "system", "content": system_message})
        
        # Add conversation history
        if conversation_history:
            for message in conversation_history[-10:]:  # Limit to last 10 messages
                messages.append({
                    "role": message["role"],
                    "content": message["content"]
                })
        
        # Add the current user message
        messages.append({"role": "user", "content": user_message})
        
        # Generate response
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.7,
            max_tokens=1000
        )
        
        # Format the response
        message_content = response.choices[0].message.content
        
        # Extract sources from context
        sources = []
        if context:
            for item in context:
                source = item['metadata']['source']
                if source not in [s['name'] for s in sources]:
                    sources.append({
                        'name': source,
                        'preview': item['metadata'].get('content_preview', '')
                    })
        
        return {
            'message': message_content,
            'sources': sources
        }