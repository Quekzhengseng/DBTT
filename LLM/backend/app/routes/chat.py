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
        
        # Get user ID if available (use "anonymous" as default)
        user_id = data.get("user_id", "anonymous")

        # Process with LLM
        response = current_app.services.llm_service.generate_response(
            user_id=user_id,  # Pass user_id
            user_message=user_message,
            conversation_history=history,
            context=relevant_context,
            conversation_id=conversation_id
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
        
        # Return the complete response including image and additional_images if present
        return jsonify({
            'message': response['message'],
            'sources': response.get('sources', []),
            'image': response.get('image'),
            'additional_images': response.get('additional_images')
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
    """Get a list of all conversations with their titles."""
    conversations = current_app.services.firebase_service.get_all_conversations()

    return jsonify([
        {
            "id": conv["id"],
            "title": conv.get("title", f"Conversation {conv['id'][:5]}") if conv.get("title") else "New Conversation",
            "updated_at": conv.get("updated_at")  # ✅ Removed message_count
        }
        for conv in conversations
    ])




@chat_bp.route('/new', methods=['POST'])
def create_conversation():
    """Create a new conversation with a meaningful title."""
    data = request.json
    user_message = data.get('message', '')

    # Generate title based on the user's first input
    title = current_app.services.llm_service.generate_conversation_title(user_message) if user_message else "New Conversation"

    conversation_id = current_app.services.firebase_service.create_conversation(title)
    return jsonify({'conversation_id': conversation_id, 'title': title})

