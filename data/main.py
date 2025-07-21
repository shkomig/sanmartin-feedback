# Azure Function for handling survey responses
from flask import Flask, request, jsonify
from azure.cosmos import CosmosClient
import os

app = Flask(__name__)

# Initialize Cosmos DB client
COSMOS_ENDPOINT = os.getenv('COSMOS_ENDPOINT')
COSMOS_KEY = os.getenv('COSMOS_KEY')
DATABASE_NAME = 'SurveyDatabase'
CONTAINER_NAME = 'Responses'

client = CosmosClient(COSMOS_ENDPOINT, COSMOS_KEY)
database = client.create_database_if_not_exists(id=DATABASE_NAME)
container = database.create_container_if_not_exists(
    id=CONTAINER_NAME,
    partition_key={'path': '/id'},
    offer_throughput=400
)

@app.route('/submit', methods=['POST'])
def submit_response():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Invalid input"}), 400

        # Add response to Cosmos DB
        container.create_item(body=data)
        return jsonify({"message": "Response submitted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/responses', methods=['GET'])
def get_responses():
    try:
        # Query all items from Cosmos DB
        items = list(container.read_all_items())
        return jsonify(items), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
