from flask import Blueprint, Flask, request, jsonify, current_app
from flask_cors import CORS
from flask_pymongo import PyMongo
from dotenv import dotenv_values
from bson import ObjectId
from datetime import datetime, timedelta

# Flask Blueprint configuration
request_blueprint = Blueprint('request_blueprint', __name__)

@request_blueprint.route('/shopping-request', methods=['POST'])
def submit_shopping_request():
    mongo = current_app.config['MONGO']
    try:
        data = request.json
        data['createdAt'] = datetime.utcnow()

        request_collection = mongo.db.requests
        result = request_collection.insert_one(data)
        generated_id = str(result.inserted_id)

        return jsonify({'message': 'Shopping request submitted successfully', '_id': generated_id}), 200
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
    
@request_blueprint.route('/get-match-requests', methods=['GET'])
def get_match_requests():
    mongo = current_app.config['MONGO']
    try:
        request_collection = mongo.db.requests
        current_user_id = request.args.get('userID')
        print(f"Current User ID: {current_user_id}")
        request_list = []

        query = {'userID': {'$ne': current_user_id}, 'status': 'Active'}

        for doc in request_collection.find(query):
            requests = {
                "reqID": str(doc["_id"]),
                "userID": doc["userID"],
                "category": doc["category"],
                "quantity": doc["quantity"],
                "location": doc["location"],
                "timeStart": doc["timeStart"],
                "timeEnd": doc["timeEnd"],
                "status": doc["status"]
            }
            print(f"ReqID: {requests.get('reqID')}")
            request_list.append(requests)

        return jsonify(request_list)
    except Exception as e:
        return jsonify(error={"message": str(e)})
    
# with current_app.app_context():
#     current_app.config["MONGO"].db.requests.create_index("createdAt", expireAfterSeconds=2592000)  # 30 days in seconds

# current_app.config["MONGO"].db.requests.update_many(
#     {"createdAt": {"$exists": False}},
#     {"$set": {"createdAt": datetime.utcnow()}}
# )