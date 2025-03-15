from flask import Blueprint, request, jsonify, current_app
import json

issues_bp = Blueprint('issues', __name__)

@issues_bp.route('/submit', methods=['POST'])
def submit_issue():
    """Submit a new complaint or issue, classify it using AI, and store it in Firebase."""
    try:
        data = request.json
        user_id = data.get('user_id', 'anonymous')
        user_message = data.get('message', '')
        
        # Additional user data
        user_name = data.get('user_name')
        user_email = data.get('user_email')
        order_id = data.get('order_id')
        
        if not user_message:
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        # Classify issue type and urgency using LLM
        issue_type, urgency = current_app.services.llm_service.classify_issue(user_message)
        
        # Log issue in Firebase
        ticket_id = current_app.services.firebase_service.log_complaint(
            user_id=user_id,
            user_message=user_message,
            intent=issue_type,
            urgency=urgency,
            order_id=order_id,
            user_name=user_name,
            user_email=user_email
        )
        
        return jsonify({
            'message': "Thank you for reaching out. Your request has been recorded, and our team will assist you shortly.",
            'ticket_id': ticket_id,
            'issue_type': issue_type,
            'urgency': urgency
        })
    except Exception as e:
        print(f"Error submitting issue: {e}")
        return jsonify({'error': 'Failed to submit issue', 'message': str(e)}), 500


@issues_bp.route('/tickets', methods=['GET'])
def get_all_tickets():
    """Retrieve all submitted tickets for the CRM dashboard."""
    try:
        tickets = current_app.services.firebase_service.get_all_tickets()
        return jsonify(tickets)
    
    except Exception as e:
        print(f"Error retrieving tickets: {e}")
        return jsonify({'error': 'Failed to retrieve tickets'}), 500


@issues_bp.route('/ticket/<ticket_id>', methods=['GET'])
def get_ticket(ticket_id):
    """Retrieve a specific ticket by ticket_id."""
    try:
        ticket = current_app.services.firebase_service.get_ticket(ticket_id)
        if not ticket:
            return jsonify({'error': 'Ticket not found'}), 404
        
        return jsonify(ticket)
    
    except Exception as e:
        print(f"Error retrieving ticket {ticket_id}: {e}")
        return jsonify({'error': 'Failed to retrieve ticket'}), 500


@issues_bp.route('/ticket/<ticket_id>', methods=['PATCH'])
def update_ticket_status(ticket_id):
    """Update the status of a ticket (e.g., 'In Progress', 'Resolved')."""
    try:
        data = request.json
        new_status = data.get('status', '').strip()

        if not new_status:
            return jsonify({'error': 'Status cannot be empty'}), 400

        success = current_app.services.firebase_service.update_ticket_status(ticket_id, new_status)
        
        if not success:
            return jsonify({'error': 'Ticket not found or failed to update'}), 404
        
        return jsonify({'message': 'Ticket status updated successfully'})

    except Exception as e:
        print(f"Error updating ticket {ticket_id}: {e}")
        return jsonify({'error': 'Failed to update ticket'}), 500
