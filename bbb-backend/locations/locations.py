from flask import Flask, jsonify, request, Blueprint
from flask_cors import CORS
from flask_pymongo import PyMongo
import os
from dotenv import load_dotenv, find_dotenv
from bson import ObjectId
from flask import jsonify


app = Flask(__name__)


CORS(app, origins='http://127.0.0.1:5000')

load_dotenv (find_dotenv())
username = os.getenv("MONGODB_USER")
password = os.getenv("MONGODB_PWD")
app.config["MONGO_URI"] = f"mongodb+srv://{username}:{password}@atlascluster.zojbxi7.mongodb.net/bbb"

mongo = PyMongo(app)

# locations_api = Blueprint('locations_api', __name__)
# @locations_api.route('/get_locations', methods=['GET'])

@app.route('/get_locations', methods=['GET'])
def get_locations():
    try: 
        locations_collection = mongo.db.locations
        locations_list = []
        for doc in locations_collection.find():
            location = {
                "_id": str(doc["_id"]),
                "name": doc["name"],
                "address": doc["address"],
                "coordinates": doc["location"]["coordinates"],
                "openHours": doc["openHours"]
            }
            locations_list.append(location)
        return jsonify(locations_list)
    except Exception as e:
        return jsonify(error={"message": str(e)})


@app.route('/get_user_location/<user_id>', methods=['GET'])
def get_user_location(user_id):
    try:
        users_collection = mongo.db.users
        user = users_collection.find_one({"uid": user_id})
        if user and user.get('location'): 
            location_doc = mongo.db.locations.find_one({"name": user['location']})
            if location_doc:
                user_location = {
                    "coordinates": location_doc["location"]["coordinates"]
                }
                return jsonify(user_location)
        durham_location = mongo.db.locations.find_one({"name": "Durham"})
        if durham_location:  
            return jsonify({"coordinates": durham_location["location"]["coordinates"]})
        return jsonify(error={"message": "Durham location not found."})
    except Exception as e:
        return jsonify(error={"message": str(e)})



@app.route('/get_request_location/<request_id>', methods=['GET'])
def get_request_location(request_id):
    try:
        requests_collection = mongo.db.requests
        request = requests_collection.find_one({"_id": ObjectId(request_id)})
        if request and 'location' in request:
            location_name = request['location']
            locations_collection = mongo.db.locations
            location_doc = locations_collection.find_one({"name": location_name})
            if location_doc:
                request_location = {
                    "coordinates": location_doc["location"]["coordinates"],
                    "location_id": str(location_doc["_id"])  
                }
                return jsonify(request_location)
            else:
                return jsonify(error={"message": "Location not found in locations collection."})
        else:
            return jsonify(error={"message": "Request does not have a location field or request not found."})
    except Exception as e:
        return jsonify(error={"message": str(e)})





if __name__ == '__main__':
    with app.app_context():
        if mongo.cx.server_info():
            print("MongoDB connection successful.")
        else:
            print("MongoDB connection failed.")
    app.run(port=5000)

