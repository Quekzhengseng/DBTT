from flask import Blueprint, request, jsonify, current_app
import json

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/send', methods=['POST'])
def send_message():
    """Process a user's chat message and return an AI response."""
    try:
        data = request.json
        
        # Extract data from request with defaults
        user_message = data.get('message', '')
        conversation_id = data.get('conversation_id', 'default-conversation')
        
        # Get conversation history (empty list if error)
        try:
            history = current_app.services.firebase_service.get_conversation_history(conversation_id)
        except Exception as e:
            print(f"Error getting conversation history: {e}")
            history = []
        
        # Retrieve relevant context (empty list if error)
        try:
            relevant_context = current_app.services.chroma_service.query(user_message)
        except Exception as e:
            print(f"Error getting relevant context: {e}")
            relevant_context = []
        
        # Process with LLM
        response = current_app.services.llm_service.generate_response(
            user_message=user_message,
            conversation_history=history,
            context=relevant_context
        )
        
        # Try to store the conversation, but continue if it fails
        try:
            current_app.services.firebase_service.add_to_conversation(
                conversation_id=conversation_id,
                user_message=user_message,
                ai_response=response['message'],
                sources=response.get('sources', [])
            )
        except Exception as e:
            print(f"Error storing conversation: {e}")
        
        return jsonify({
            'message': response['message'],
            'sources': response.get('sources', [])
        })
    except Exception as e:
        print(f"Error in chat processing: {e}")
        return jsonify({
            'error': 'Failed to process message',
            'message': str(e)
        }), 500

@chat_bp.route('/history/<conversation_id>', methods=['GET'])
def get_conversation_history(conversation_id):
    """Retrieve conversation history for a specific conversation."""
    history = current_app.services.firebase_service.get_conversation_history(conversation_id)
    return jsonify(history)

@chat_bp.route('/conversations', methods=['GET'])
def get_conversations():
    """Get a list of all conversations."""
    conversations = current_app.services.firebase_service.get_all_conversations()
    return jsonify(conversations)

@chat_bp.route('/new', methods=['POST'])
def create_conversation():
    """Create a new conversation."""
    data = request.json
    title = data.get('title', 'New Conversation')
    
    conversation_id = current_app.services.firebase_service.create_conversation(title)
    return jsonify({'conversation_id': conversation_id})