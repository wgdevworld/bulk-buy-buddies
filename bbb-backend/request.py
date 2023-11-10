from flask import Flask, request, jsonify, Blueprint, current_app
# from flask_cors import CORS
# from flask_pymongo import PyMongo
from dotenv import dotenv_values


requests_api = Blueprint('requests_api', __name__)

# secrets = dotenv_values(".env")
# current_app.config["MONGO_URI"] = f"mongodb+srv://{secrets['ATLAS_USR']}:{secrets['ATLAS_PWD']}@atlascluster.zojbxi7.mongodb.net/bbb?retryWrites=true&w=majority"

# mongo = PyMongo(current_app)
mongo = current_app.config['MONGO']

@requests_api.route('/shopping-request', methods=['POST'])
def submit_shopping_request():
    try:
        data = request.json
        request_collection = mongo.db.requests
        request_collection.insert_one(data)
        return jsonify({'message': 'Shopping request submitted successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to process the request'}), 500


