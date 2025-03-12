import firebase_admin
from firebase_admin import credentials, firestore
import datetime
import json
import uuid

class FirebaseService:
    """Service for interacting with Firebase Firestore."""
    
    def __init__(self, credentials_path=None):
        """Initialize Firebase connection."""
        if credentials_path:
            try:
                # Initialize with credentials file
                cred = credentials.Certificate(credentials_path)
                firebase_admin.initialize_app(cred)
                self.db = firestore.client()
                self.initialized = True
            except Exception as e:
                print(f"Firebase initialization error: {e}")
                self.initialized = False
        else:
            # Initialize without credentials for mock/local mode
            self.initialized = False
            self.local_storage = {
                'conversations': {}
            }
    
    def create_conversation(self, title):
        """Create a new conversation."""
        conversation_id = str(uuid.uuid4())
        timestamp = datetime.datetime.now()
        
        conversation_data = {
            'id': conversation_id,
            'title': title,
            'created_at': timestamp,
            'updated_at': timestamp,
            'messages': []
        }
        
        if self.initialized:
            self.db.collection('conversations').document(conversation_id).set(conversation_data)
        else:
            self.local_storage['conversations'][conversation_id] = conversation_data
        
        return conversation_id
    
    def get_conversation_history(self, conversation_id):
        """Get the conversation history for a specific conversation."""
        if not conversation_id:
            return []
            
        if self.initialized:
            doc_ref = self.db.collection('conversations').document(conversation_id)
            doc = doc_ref.get()
            
            if doc.exists:
                conversation = doc.to_dict()
                return conversation.get('messages', [])
            return []
        else:
            conversation = self.local_storage['conversations'].get(conversation_id, {})
            return conversation.get('messages', [])
    
# In backend/app/services/firebase.py, update the add_to_conversation method

    def add_to_conversation(self, conversation_id, user_message, ai_response, sources=None):
        """Add a message pair to the conversation history."""
        timestamp = datetime.datetime.now()
        
        user_message_data = {
            'role': 'user',
            'content': user_message,
            'timestamp': timestamp
        }
        
        ai_message_data = {
            'role': 'assistant',
            'content': ai_response,
            'sources': sources,
            'timestamp': timestamp
        }
        
        if self.initialized:
            try:
                # Check if conversation exists first
                conversation_ref = self.db.collection('conversations').document(conversation_id)
                doc = conversation_ref.get()
                
                if not doc.exists:
                    # Create the conversation if it doesn't exist
                    conversation_data = {
                        'id': conversation_id,
                        'title': f"Conversation {conversation_id}",
                        'created_at': timestamp,
                        'updated_at': timestamp,
                        'messages': [user_message_data, ai_message_data]
                    }
                    conversation_ref.set(conversation_data)
                else:
                    # Update existing conversation
                    conversation_ref.update({
                        'messages': firestore.ArrayUnion([user_message_data, ai_message_data]),
                        'updated_at': timestamp
                    })
            except Exception as e:
                print(f"Error storing conversation: {e}")
                # Fall back to local storage
                if conversation_id not in self.local_storage['conversations']:
                    self.local_storage['conversations'][conversation_id] = {
                        'id': conversation_id,
                        'title': f"Conversation {conversation_id}",
                        'created_at': timestamp,
                        'updated_at': timestamp,
                        'messages': []
                    }
                
                self.local_storage['conversations'][conversation_id]['messages'].extend([
                    user_message_data, ai_message_data
                ])
                self.local_storage['conversations'][conversation_id]['updated_at'] = timestamp
        else:
            # Store in local storage
            if conversation_id not in self.local_storage['conversations']:
                self.local_storage['conversations'][conversation_id] = {
                    'id': conversation_id,
                    'title': f"Conversation {conversation_id}",
                    'created_at': timestamp,
                    'updated_at': timestamp,
                    'messages': []
                }
            
            self.local_storage['conversations'][conversation_id]['messages'].extend([
                user_message_data, ai_message_data
            ])
            self.local_storage['conversations'][conversation_id]['updated_at'] = timestamp
    
    def get_all_conversations(self):
        """Get a list of all conversations."""
        if self.initialized:
            conversations = []
            query = self.db.collection('conversations').order_by('updated_at', direction=firestore.Query.DESCENDING)
            docs = query.stream()
            
            for doc in docs:
                conversation = doc.to_dict()
                # Include only summary info, not all messages
                conversations.append({
                    'id': conversation.get('id'),
                    'title': conversation.get('title'),
                    'created_at': conversation.get('created_at'),
                    'updated_at': conversation.get('updated_at'),
                    'message_count': len(conversation.get('messages', []))
                })
            
            return conversations
        else:
            # Return from local storage
            return [
                {
                    'id': conv_id,
                    'title': conv.get('title'),
                    'created_at': conv.get('created_at'),
                    'updated_at': conv.get('updated_at'),
                    'message_count': len(conv.get('messages', []))
                }
                for conv_id, conv in self.local_storage['conversations'].items()
            ]