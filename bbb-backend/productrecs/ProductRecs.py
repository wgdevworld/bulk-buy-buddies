from flask import Blueprint, Flask, jsonify, request, current_app
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from dotenv import dotenv_values

productRec_blueprint = Blueprint('productRec', __name__)

@productRec_blueprint.route("/fetchSimilarProducts", methods=['GET'])
def fetchBestProduct():
    mongo = current_app.config['MONGO']
    try:
        category_str = request.args.get('userCategory')

        user_quantity_str = request.args.get('userQuantity')
        buddy_quantity_str = request.args.get('buddyQuantity')

        location = request.args.get('location')
        location_int = int(location)
        user_quantity = int(user_quantity_str)
        buddy_quantity = int(buddy_quantity_str)

        desired_quantity = user_quantity + buddy_quantity
        lower_bound = int(desired_quantity*0.8)
        upper_bound = int(desired_quantity*1.2)       

        print(category_str, location, location_int, user_quantity, buddy_quantity, lower_bound, upper_bound)
        
        products = list(mongo.db.products.find({'category':category_str, 'locations': location_int, 'quantity':{'$lte':upper_bound,'$gte':lower_bound}}))
        results = []
        for product in products:
            product['_id'] = str(product['_id'])
            results.append(product)

        return jsonify(results=results)
    except Exception as e:
        return jsonify(error=f"An unexpected error occurred: {str(e)}"), 500

@productRec_blueprint.route("/fetchBuddyInfo", methods=['GET'])
def fetchBuddyInfo():
    mongo = current_app.config['MONGO']
    try:
        buddyID = request.args.get('buddyID')
        buddyInfo = mongo.db.users.find_one({'uid':buddyID})
        # Mongo's _id is not serializable
        if buddyInfo and "_id" in buddyInfo:
            buddyInfo["_id"] = str(buddyInfo["_id"])
        return jsonify(results=buddyInfo)
    except Exception as e:
        return jsonify(error=f"An unexpected error occurred: {str(e)}"), 500

@productRec_blueprint.route("/buddy-request", methods=['POST'])
def submit_buddy_request():
    mongo = current_app.config['MONGO']
    try:
        data = request.json
        userInteractions = mongo.db.userInteractions
        userInteractions.insert_one(data)
        return jsonify({'message': 'Buddy request submitted successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to process the request'}), 500

@productRec_blueprint.route("/fetchRequestInfo", methods=['GET'])
def fetchRequestInfo():
    mongo = current_app.config['MONGO']
    try:
        data = request.args.get('requestID')
        request_object = ObjectId(data)
        requestsCollection = mongo.db.requests
        request_info = requestsCollection.find_one({'_id': request_object})
        # Mongo's _id is not serializable
        if request_info and "_id" in request_info:
            request_info["_id"] = str(request_info["_id"])
        return jsonify(results=request_info)
    except Exception as e:
        return jsonify({'error': 'Failed to process the request'}), 500
