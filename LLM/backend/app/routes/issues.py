from flask import Blueprint, request, jsonify, current_app
import json
import traceback

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
        print(traceback.format_exc())  # Print full stack trace
        return jsonify({'error': 'Failed to submit issue', 'message': str(e)}), 500


@issues_bp.route('/tickets', methods=['GET'])
def get_all_tickets():
    """Retrieve all submitted tickets for the CRM dashboard."""
    try:
        print("GET /tickets endpoint called")
        tickets = current_app.services.firebase_service.get_all_tickets()
        
        # Debug: Print what we got back
        print(f"Retrieved {len(tickets)} tickets from firebase_service")
        
        if tickets and len(tickets) > 0:
            # Test serialization
            try:
                test_json = json.dumps(tickets)
                print(f"Successfully serialized tickets to JSON, length: {len(test_json)}")
            except Exception as json_error:
                print(f"ERROR: Could not serialize tickets to JSON: {json_error}")
                print(f"First ticket: {tickets[0]}")
                import traceback
                traceback.print_exc()
                
                # Try a safer approach - convert each ticket
                safe_tickets = []
                for ticket in tickets:
                    safe_ticket = {}
                    for key, value in ticket.items():
                        try:
                            # Test if this field can be serialized
                            json.dumps({key: value})
                            safe_ticket[key] = value
                        except:
                            # If not, convert to string
                            safe_ticket[key] = str(value)
                    safe_tickets.append(safe_ticket)
                tickets = safe_tickets
                print("Converted to safe tickets")
        
        # Add CORS headers
        response = jsonify(tickets)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    
    except Exception as e:
        print(f"Error retrieving tickets: {e}")
        import traceback
        traceback.print_exc()
        
        error_response = jsonify({
            'error': 'Failed to retrieve tickets',
            'message': str(e)
        })
        error_response.headers.add('Access-Control-Allow-Origin', '*')
        return error_response, 500


@issues_bp.route('/ticket/<ticket_id>', methods=['GET'])
def get_ticket(ticket_id):
    """Retrieve a specific ticket by ticket_id."""
    try:
        print(f"GET /ticket/{ticket_id} endpoint called")
        ticket = current_app.services.firebase_service.get_ticket(ticket_id)
        if not ticket:
            print(f"Ticket {ticket_id} not found")
            return jsonify({'error': 'Ticket not found'}), 404
        
        print(f"Returning ticket: {json.dumps(ticket, default=str)}")
        return jsonify(ticket)
    
    except Exception as e:
        print(f"Error retrieving ticket {ticket_id}: {e}")
        print(traceback.format_exc())  # Print full stack trace
        return jsonify({'error': 'Failed to retrieve ticket', 'message': str(e)}), 500


@issues_bp.route('/ticket/<ticket_id>', methods=['PATCH'])
def update_ticket_status(ticket_id):
    """Update the status of a ticket (e.g., 'In Progress', 'Resolved')."""
    try:
        print(f"PATCH /ticket/{ticket_id} endpoint called")
        data = request.json
        new_status = data.get('status', '').strip()

        if not new_status:
            return jsonify({'error': 'Status cannot be empty'}), 400

        print(f"Updating ticket {ticket_id} status to '{new_status}'")
        success = current_app.services.firebase_service.update_ticket_status(ticket_id, new_status)
        
        if not success:
            print(f"Ticket {ticket_id} not found or failed to update")
            return jsonify({'error': 'Ticket not found or failed to update'}), 404
        
        print(f"Ticket {ticket_id} status updated successfully to '{new_status}'")
        return jsonify({'message': 'Ticket status updated successfully'})

    except Exception as e:
        print(f"Error updating ticket {ticket_id}: {e}")
        print(traceback.format_exc())  # Print full stack trace
        return jsonify({'error': 'Failed to update ticket', 'message': str(e)}), 500
    
@issues_bp.route('/test-firebase', methods=['GET'])
def test_firebase():
    """Test if Firebase is working correctly."""
    firebase_initialized = current_app.services.firebase_service.initialized
    result = {
        "firebase_initialized": firebase_initialized,
        "mode": "production" if firebase_initialized else "local/mock"
    }
    
    # Try to access a document to verify connection
    if firebase_initialized:
        try:
            # Count tickets for a simple test
            count = len(current_app.services.firebase_service.get_all_tickets())
            result["connection_test"] = "success"
            result["tickets_count"] = count
        except Exception as e:
            result["connection_test"] = "failed"
            result["error"] = str(e)
    
    return jsonify(result)

@issues_bp.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint."""
    firebase_initialized = current_app.services.firebase_service.initialized
    return jsonify({
        "status": "ok",
        "firebase_initialized": firebase_initialized
    })
    
@issues_bp.route('/create-test-ticket', methods=['POST'])
def create_test_ticket():
    """Create a test ticket for troubleshooting."""
    try:
        ticket_id = current_app.services.firebase_service.log_complaint(
            user_id="test-user",
            user_message="This is a test ticket created for troubleshooting",
            intent="Test",
            urgency="Low"
        )
        
        return jsonify({
            'success': True,
            'ticket_id': ticket_id,
            'message': 'Test ticket created successfully'
        })
    except Exception as e:
        import traceback
        print(f"Error creating test ticket: {e}")
        print(traceback.format_exc())
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
    
@issues_bp.route('/simple-test', methods=['GET'])
def simple_test():
    """Super simple endpoint that returns static data only."""
    return jsonify({
        'status': 'ok',
        'test_data': [
            {'id': 1, 'name': 'Test Ticket 1'},
            {'id': 2, 'name': 'Test Ticket 2'}
        ]
    })

@issues_bp.route('/basic-test', methods=['GET'])
def basic_test():
    """The most basic test endpoint."""
    return jsonify({
        'status': 'ok',
        'message': 'Issues API is working'
    })

@issues_bp.route('/mock-tickets', methods=['GET'])
def mock_tickets():
    """Return hardcoded mock tickets directly from the issues blueprint."""
    mock_tickets = [
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
    return jsonify(mock_tickets)