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
        
        # products = list(mongo.db.products.find({'category':category_str, 'locations': {'$in' : [location_int]}, 'quantity':{'$lte':upper_bound,'$gte':lower_bound}}))
        products = list(mongo.db.products.find({'category':category_str, 'quantity':{'$lte':upper_bound,'$gte':lower_bound}}))

        results = []
        for product in products:
            product['_id'] = str(product['_id'])
            results.append(product)
        print("length is", len(results))
        return jsonify(results=results)
    except Exception as e:
        return jsonify(error=f"An unexpected error occurred: {str(e)}"), 500

@productRec_blueprint.route("/fetchBuddyInfo", methods=['GET'])
def fetchBuddyInfo():
    mongo = current_app.config['MONGO']
    try:
        buddyID = request.args.get('buddyID')
        print("Buddy ID is:", buddyID)
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
        print(data)
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
        print("Object ID value is:", data)
        request_object = ObjectId(data)
        print(request_object)
        requestsCollection = mongo.db.requests
        request_info = requestsCollection.find_one({'_id': request_object})
        print(request_info)
        # Mongo's _id is not serializable
        if request_info and "_id" in request_info:
            request_info["_id"] = str(request_info["_id"])
        return jsonify(results=request_info)
    except Exception as e:
        return jsonify({'error': 'Failed to process the request'}), 500

@productRec_blueprint.route("/update_transactions", methods=['POST'])
def update_transactions():
    mongo = current_app.config['MONGO']
    try:
        data = request.json
        request_object = ObjectId(data['requestID'])
        requestsCollection = mongo.db.requests
        productsCollection = mongo.db.products
        product = productsCollection.find_one({'_id':ObjectId(data['productId'])})
        to_update = requestsCollection.find_one({'_id':request_object})
        requestsCollection.update_one({'_id':request_object}, {'$set': {"status":"Fulfilled", "category":product['name'], "quantity":int(data['product_quantity'])}})
        transactionHistory = mongo.db.transactionHistory
        transactionHistory.insert_one({'requestId':data['requestID'], "userId":to_update['userID'], "products":product['name'], "quantity":int(data['product_quantity'])})
        # Mongo's _id is not serializable
        return jsonify({'message': 'Successful!'}), 200 
    except Exception as e:
        print(e)
        return jsonify({'error': 'Failed to process the request'}), 500

@productRec_blueprint.route("/update-database", methods=['POST'])
def update_database():
    mongo = current_app.config['MONGO']
    try:
        data = request.json
        print(data)
        user_reqid = data['from_requestID']
        buddy_reqid = data['to_requestID']
        requestsCollection = mongo.db.requests
        userInteractions = mongo.db.userInteractions
        to_match = userInteractions.find_one({'from_requestID': buddy_reqid, 'to_requestID': user_reqid})
        print(to_match)
        userInteractions.update_one({'_id': ObjectId(to_match['_id'])}, {"$set": {"status":"matched"}})
        requestsCollection.update_one({'_id': ObjectId(user_reqid)}, {'$set': {"status":"Matched"}})
        requestsCollection.update_one({'_id': ObjectId(buddy_reqid)}, {'$set': {"status":"Matched"}})
        return jsonify({'message': 'Database Updated Successfully!'}), 200
    except Exception as e:
        print("aslkfjsldkfj")
        print(f"error: {e}")
        return jsonify({'error': 'Failed to process the request'}), 400

