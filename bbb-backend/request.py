from flask import Blueprint, Flask, request, jsonify, current_app
from flask_cors import CORS
from flask_pymongo import PyMongo
from dotenv import dotenv_values

# Flask Blueprint configuration
request_blueprint = Blueprint('request_blueprint', __name__)

@request_blueprint.route('/shopping-request', methods=['POST'])
def submit_shopping_request():
    mongo = current_app.config['MONGO']
    try:
        data = request.json
        request_collection = mongo.db.requests
        request_collection.insert_one(data)
        return jsonify({'message': 'Shopping request submitted successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to process the request'}), 500


@request_blueprint.route('/get-requests', methods=['GET'])
def get_my_requests():
    mongo = current_app.config['MONGO']
    try: 
        request_collection = mongo.db.requests
        request_list = []
        for doc in request_collection.find():
            request = {
                "_id": str(doc["_id"]),
                "userID": doc["userID"],
                "category": doc["category"],
                "quantity": doc["quantity"],
                "location": doc["location"],
                "timeStart": doc["timeStart"],
                "timeEnd": doc["timeEnd"],
                "status": doc["status"]
            }
            request_list.append(request)
        return jsonify(request_list)
    except Exception as e:
        return jsonify(error={"message": str(e)})
