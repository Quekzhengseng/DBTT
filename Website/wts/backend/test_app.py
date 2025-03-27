from flask import Flask, jsonify
from flask_cors import CORS
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route('/api/test', methods=['GET'])
def test():
    logger.info("Test endpoint called")
    return jsonify({"status": "ok", "message": "Test endpoint works!"})

@app.route('/api/issues/simple-test', methods=['GET'])
def simple_test():
    logger.info("Simple test endpoint called")
    return jsonify({
        'status': 'ok',
        'test_data': [
            {'id': 1, 'name': 'Test Ticket 1'},
            {'id': 2, 'name': 'Test Ticket 2'}
        ]
    })

if __name__ == '__main__':
    logger.info("Starting test Flask app")
    app.run(host='0.0.0.0', port=5001, debug=True)