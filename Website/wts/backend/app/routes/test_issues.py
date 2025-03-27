from flask import Blueprint, jsonify

test_issues_bp = Blueprint('test_issues', __name__)

@test_issues_bp.route('/simple', methods=['GET'])
def simple_test():
    """Super simple endpoint that returns static data only."""
    return jsonify({
        'status': 'ok',
        'test_data': [
            {'id': 1, 'name': 'Test Ticket 1'},
            {'id': 2, 'name': 'Test Ticket 2'}
        ]
    })

@test_issues_bp.route('/mock-tickets', methods=['GET'])
def mock_tickets():
    """Return hardcoded mock tickets."""
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