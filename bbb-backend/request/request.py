from flask import Blueprint, Flask, request, jsonify, current_app
from flask_cors import CORS
from flask_pymongo import PyMongo
from dotenv import dotenv_values

request_blueprint = Blueprint('request_blueprint', __name__)

@request_blueprint.route('/shopping-request', methods=['POST'])
def submit_shopping_request():
    mongo = current_app.config['MONGO']
    try:
        data = request.json
        request_collection = mongo.db.requests
        result = request_collection.insert_one(data)
        generated_id = str(result.inserted_id)

        return jsonify({'message': 'Shopping request submitted successfully', '_id': generated_id}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to process the request'}), 500



@request_blueprint.route('/get_requests_in_location/<location_id>', methods=['GET'])
def get_requests_on_this_location(location_id):
    try:
        mongo = current_app.config['MONGO']
        requests_collection = mongo.db.requests
        requests_list = []
        for doc in requests_collection.find({"location": int(location_id)}):
            request = {
                "userID": doc["userID"],
                "category": doc["category"],
                "quantity": doc["quantity"],
                "timeStart": doc["timeStart"],
                "timeEnd": doc["timeEnd"],
            }
            requests_list.append(request)
        return jsonify(requests_list)
    except Exception as e:
        return jsonify(error={"message": str(e)})
    
    
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

@request_blueprint.route('/log-transaction-history', methods=['POST'])
def log_transaction_history():
    mongo = current_app.config['MONGO']
    try:
        transaction_history_collection = mongo.db.transactionHistory
        request_data = request.json
        
        requestId = request_data.get('requestId')
        userId = request_data.get('userId')
        category = request_data.get('category')
        quantity = request_data.get('quantity')

        if not all([requestId, userId, category, quantity is not None]):
            return jsonify({"error": "Missing required fields"}), 400

        transaction_record = {
            "requestId": requestId,
            "userId": userId,
            "category": category,
            "quantity": quantity,
        }

        transaction_history_collection.insert_one(transaction_record)

        return jsonify({"message": "Transaction logged successfully"}), 201

    except Exception as e:
        # Detailed error logging
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500