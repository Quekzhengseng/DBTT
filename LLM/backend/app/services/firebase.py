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
                print("✅ Firebase successfully initialized with credentials file")
            except Exception as e:
                print(f"Firebase initialization error: {e}")
                self.initialized = False
        else:
            # Initialize without credentials for mock/local mode
            self.initialized = False
            self.local_storage = {'conversations': {}}
            print("⚠️ Firebase initialized in local/mock mode (no credentials)")
    
    def create_conversation(self, title="New Conversation"):
        """Create a new conversation with a generated ID."""
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
    
 
    def log_complaint(self, user_id, user_message, intent, urgency, order_id=None, user_name=None, user_email=None):
        """Logs user complaint into Firebase with a ticket ID."""
        ticket_id = str(datetime.datetime.now().timestamp()).replace('.', '')
        timestamp = datetime.datetime.now()

        complaint_data = {
            "ticket_id": ticket_id,
            "user_id": user_id,
            "message": user_message,
            "intent": intent,
            "urgency": urgency,
            "status": "Open",
            "created_at": timestamp,
            "updated_at": timestamp,
            "order_id": order_id,
            "user_name": user_name,
            "user_email": user_email
        }

        if self.initialized:
            try:
                # Make sure to properly format the data for Firestore
                formatted_data = {}
                for key, value in complaint_data.items():
                    if isinstance(value, datetime.datetime):
                        # Keep datetime objects as they work in Firestore
                        formatted_data[key] = value
                    elif value is None:
                        # Set explicit null values to empty strings for better display
                        formatted_data[key] = ""
                    else:
                        formatted_data[key] = value
                
                self.db.collection("complaints").document(ticket_id).set(formatted_data)
                print(f"✅ Complaint logged in Firebase with ID: {ticket_id}")
                print(f"Firebase data: {formatted_data}")
            except Exception as e:
                print(f"⚠️ Error logging complaint in Firebase: {e}")
                # Fall back to local storage
                if not hasattr(self, 'local_storage'):
                    self.local_storage = {}
                
                if 'complaints' not in self.local_storage:
                    self.local_storage['complaints'] = {}
                    
                self.local_storage['complaints'][ticket_id] = complaint_data
                print(f"✅ Complaint logged in local storage with ID: {ticket_id}")
        else:
            # Store in local storage if Firebase isn't initialized
            if not hasattr(self, 'local_storage'):
                self.local_storage = {}
            
            if 'complaints' not in self.local_storage:
                self.local_storage['complaints'] = {}
                
            self.local_storage['complaints'][ticket_id] = complaint_data
            print(f"✅ Complaint logged in local storage with ID: {ticket_id}")
            print(f"Local storage data: {complaint_data}")

        return ticket_id
    
    def get_conversation_history(self, conversation_id):
        """Retrieve conversation history for a specific conversation."""
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

    def add_to_conversation(self, conversation_id, user_message, ai_response, sources=None):
        """Adds a message pair (user & assistant) to the conversation history."""
        timestamp = datetime.datetime.now()

        user_message_data = {
            'role': 'user',
            'content': user_message,
            'timestamp': timestamp
        }

        ai_message_data = {
            'role': 'assistant',
            'content': ai_response,
            'sources': sources if sources else [],
            'timestamp': timestamp
        }

        if self.initialized:
            try:
                conversation_ref = self.db.collection('conversations').document(conversation_id)
                doc = conversation_ref.get()

                if doc.exists:
                    conversation_ref.update({
                        'messages': firestore.ArrayUnion([user_message_data, ai_message_data]),
                        'updated_at': timestamp
                    })
                    print(f"✅ Updated conversation {conversation_id} with new messages.")
                else:
                    conversation_ref.set({
                        'id': conversation_id,
                        'title': f"Conversation {conversation_id}",
                        'created_at': timestamp,
                        'updated_at': timestamp,
                        'messages': [user_message_data, ai_message_data]
                    })
                    print(f"✅ Created new conversation {conversation_id}.")
            except Exception as e:
                print(f"⚠️ Error storing conversation in Firebase: {e}")
        else:
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
            print(f"✅ Updated local storage for conversation {conversation_id}.")

    def get_conversation_title(self, conversation_id):
        """Fetches the title of a conversation from Firebase."""
        if self.initialized:
            doc_ref = self.db.collection('conversations').document(conversation_id)
            doc = doc_ref.get()
            if doc.exists:
                return doc.to_dict().get('title', 'New Conversation')
        return 'New Conversation'

    def update_conversation_title(self, conversation_id, title):
        """Updates the title of a conversation in Firebase."""
        if self.initialized:
            conversation_ref = self.db.collection('conversations').document(conversation_id)
            conversation_ref.update({"title": title})
            print(f"✅ Updated conversation {conversation_id} title to: {title}")
        else:
            if conversation_id in self.local_storage["conversations"]:
                self.local_storage["conversations"][conversation_id]["title"] = title
                print(f"✅ Updated local conversation {conversation_id} title to: {title}")

    def get_all_conversations(self):
        """Retrieve a list of all conversations."""
        if self.initialized:
            conversations = []
            query = self.db.collection('conversations').order_by('updated_at', direction=firestore.Query.DESCENDING)
            docs = query.stream()

            for doc in docs:
                conversation = doc.to_dict()
                conversations.append({
                    'id': conversation.get('id'),
                    'title': conversation.get('title', f"Conversation {conversation.get('id', '')[:5]}"),
                    'created_at': conversation.get('created_at'),
                    'updated_at': conversation.get('updated_at'),
                    'message_count': len(conversation.get('messages', []))
                })

            return conversations
        else:
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
        

    def get_all_tickets(self):
        """Retrieve all submitted tickets for the CRM dashboard with safer serialization."""
        tickets = []
        
        try:
            print("Getting all tickets...")
            
            if self.initialized:
                # Firebase initialized, try to get tickets
                try:
                    print("Firebase initialized, querying Firestore...")
                    query = self.db.collection('complaints').order_by('created_at', direction=firestore.Query.DESCENDING)
                    docs = query.stream()
                    
                    # Debug: Count the documents
                    doc_count = 0
                    for doc in docs:
                        doc_count += 1
                        try:
                            # Get document data
                            ticket_data = doc.to_dict()
                            
                            # Manually convert each ticket to ensure it's serializable
                            safe_ticket = {
                                "ticket_id": str(ticket_data.get("ticket_id", "")),
                                "user_id": str(ticket_data.get("user_id", "")),
                                "message": str(ticket_data.get("message", "")),
                                "intent": str(ticket_data.get("intent", "")),
                                "urgency": str(ticket_data.get("urgency", "")),
                                "status": str(ticket_data.get("status", "Open")),
                                "user_name": str(ticket_data.get("user_name", "")),
                                "user_email": str(ticket_data.get("user_email", "")),
                                "order_id": str(ticket_data.get("order_id", ""))
                            }
                            
                            # Safely handle timestamps
                            if "created_at" in ticket_data:
                                try:
                                    timestamp = ticket_data["created_at"]
                                    if hasattr(timestamp, "isoformat"):
                                        safe_ticket["created_at"] = timestamp.isoformat()
                                    else:
                                        safe_ticket["created_at"] = str(timestamp)
                                except:
                                    safe_ticket["created_at"] = str(datetime.datetime.now())
                            else:
                                safe_ticket["created_at"] = str(datetime.datetime.now())
                                
                            if "updated_at" in ticket_data:
                                try:
                                    timestamp = ticket_data["updated_at"]
                                    if hasattr(timestamp, "isoformat"):
                                        safe_ticket["updated_at"] = timestamp.isoformat()
                                    else:
                                        safe_ticket["updated_at"] = str(timestamp)
                                except:
                                    safe_ticket["updated_at"] = str(datetime.datetime.now())
                            else:
                                safe_ticket["updated_at"] = str(datetime.datetime.now())
                            
                            tickets.append(safe_ticket)
                            print(f"Processed ticket: {safe_ticket['ticket_id']}")
                        except Exception as doc_error:
                            print(f"Error processing document: {doc_error}")
                            import traceback
                            traceback.print_exc()
                    
                    print(f"Found {doc_count} documents, processed {len(tickets)} tickets")
                    
                except Exception as firebase_error:
                    print(f"Firebase error: {firebase_error}")
                    import traceback
                    traceback.print_exc()
            else:
                # Use local storage
                print("Firebase not initialized, using local storage")
                if hasattr(self, 'local_storage') and 'complaints' in self.local_storage:
                    for ticket_id, ticket_data in self.local_storage['complaints'].items():
                        # Create a safe copy with string values
                        safe_ticket = {
                            "ticket_id": str(ticket_data.get("ticket_id", "")),
                            "user_id": str(ticket_data.get("user_id", "")),
                            "message": str(ticket_data.get("message", "")),
                            "intent": str(ticket_data.get("intent", "")),
                            "urgency": str(ticket_data.get("urgency", "")),
                            "status": str(ticket_data.get("status", "Open")),
                            "user_name": str(ticket_data.get("user_name", "")),
                            "user_email": str(ticket_data.get("user_email", "")),
                            "order_id": str(ticket_data.get("order_id", ""))
                        }
                        
                        # Handle timestamps
                        if "created_at" in ticket_data:
                            timestamp = ticket_data["created_at"]
                            if isinstance(timestamp, datetime.datetime):
                                safe_ticket["created_at"] = timestamp.isoformat()
                            else:
                                safe_ticket["created_at"] = str(timestamp)
                        else:
                            safe_ticket["created_at"] = str(datetime.datetime.now())
                            
                        if "updated_at" in ticket_data:
                            timestamp = ticket_data["updated_at"]
                            if isinstance(timestamp, datetime.datetime):
                                safe_ticket["updated_at"] = timestamp.isoformat()
                            else:
                                safe_ticket["updated_at"] = str(timestamp)
                        else:
                            safe_ticket["updated_at"] = str(datetime.datetime.now())
                        
                        tickets.append(safe_ticket)
                    
                    print(f"Retrieved {len(tickets)} tickets from local storage")
        
        except Exception as e:
            print(f"Global error in get_all_tickets: {e}")
            import traceback
            traceback.print_exc()
        
        # Return tickets (or empty list if none were found)
        return tickets or []

    def get_ticket(self, ticket_id):
        """Retrieve a specific ticket by ticket_id."""
        if self.initialized:
            doc_ref = self.db.collection('complaints').document(ticket_id)
            doc = doc_ref.get()
            if doc.exists:
                return doc.to_dict()
            return None
        else:
            # Check local storage
            if 'complaints' in self.local_storage and ticket_id in self.local_storage['complaints']:
                return self.local_storage['complaints'][ticket_id]
            return None

    def update_ticket_status(self, ticket_id, new_status):
        """Update the status of a ticket."""
        if self.initialized:
            try:
                doc_ref = self.db.collection('complaints').document(ticket_id)
                doc = doc_ref.get()
                if doc.exists:
                    doc_ref.update({
                        'status': new_status,
                        'updated_at': datetime.datetime.now()
                    })
                    return True
                return False
            except Exception as e:
                print(f"Error updating ticket status: {e}")
                return False
        else:
            # Update in local storage
            if 'complaints' in self.local_storage and ticket_id in self.local_storage['complaints']:
                self.local_storage['complaints'][ticket_id]['status'] = new_status
                self.local_storage['complaints'][ticket_id]['updated_at'] = datetime.datetime.now()
                return True
            return False
