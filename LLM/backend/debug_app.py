from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/issues/mock-tickets', methods=['GET'])
def mock_tickets():
    """Return hardcoded mock tickets directly."""
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

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)