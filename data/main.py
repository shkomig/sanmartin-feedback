# Azure Function for handling survey responses
from flask import Flask, request, jsonify

app = Flask(__name__)

# In-memory storage for demonstration purposes (replace with Azure Cosmos DB)
survey_responses = []

@app.route('/submit', methods=['POST'])
def submit_response():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Invalid input"}), 400

        # Add response to in-memory storage
        survey_responses.append(data)
        return jsonify({"message": "Response submitted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/responses', methods=['GET'])
def get_responses():
    try:
        return jsonify(survey_responses), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
