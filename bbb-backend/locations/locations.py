from flask import Flask, jsonify, Blueprint, current_app
import requests
from flask_cors import CORS
from flask_pymongo import PyMongo
import os
from bson import ObjectId
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

google_maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")

locations_blueprint = Blueprint('locations_blueprint', __name__)


@locations_blueprint.route('/get_locations', methods=['GET'])
def get_locations():
    try:
        mongo = current_app.config['MONGO']
        locations_collection = mongo.db.locations
        locations_list = []
        for doc in locations_collection.find():
            location = {
                "lid": int(doc["lid"]),  
                "name": doc["name"],
                "address": doc["address"],
                "coordinates": doc["coordinates"], 
                "openHours": doc["openHours"]
            }
            locations_list.append(location)
        return jsonify(locations_list)
    except Exception as e:
        return jsonify(error={"message": str(e)})


@locations_blueprint.route('/get_user_location/<user_id>', methods=['GET'])
def get_user_location(user_id):
    try:
        mongo = current_app.config['MONGO']
        users_collection = mongo.db.users
        user = users_collection.find_one({"uid": user_id})
        if user and 'address' in user:
            user_address = user['address'] 
            geocoding_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={user_address}&key={google_maps_api_key}"
            response = requests.get(geocoding_url)
            if response.status_code == 200:
                data = response.json()
                if "location" in data['results'][0]['geometry']:
                    location = data['results'][0]['geometry']['location']
                    print(location)
                    return jsonify(location)
                else:
                    return jsonify(error={"message": "Could not geocode address."})
            else:
                return jsonify(error={"message": "Geocoding API request failed."})
        return jsonify(error={"message": "User address not found."})
    except Exception as e:
        return jsonify(error={"message": str(e)})

@locations_blueprint.route('/get_location_name/<location_id>', methods=['GET'])
def get_location_name(location_id):
    try:
        mongo = current_app.config['MONGO']
        locations_collection = mongo.db.locations
        location = locations_collection.find_one({"lid": location_id})
        if location:
            location_name = location['name']
            return jsonify(location_name)
        return jsonify(error={"message": "Location not found."})
    except Exception as e:
        return jsonify(error={"message": str(e)})
    


# @locations_blueprint.route('/get_user_address/<user_id>', methods=['GET'])
# def get_user_address(user_id):
#     try:
#         mongo = current_app.config['MONGO']
#         users_collection = mongo.db.users
#         user = users_collection.find_one({"uid": user_id})
#         if user and 'address' in user:
#             user_address = user['address'] 
#             return jsonify(user_address)
#         return jsonify(error={"message": "User address not found."})
#     except Exception as e:
#         return jsonify(error={"message": str(e)})

# @app.route('/get_request_location/<request_id>', methods=['GET'])
# def get_request_location(request_id):
#     try:
#         requests_collection = mongo.db.requests
#         request_doc = requests_collection.find_one({"_id": ObjectId(request_id)})
#         if request_doc and 'location' in request_doc:
#             location_lid = int(request_doc['location']) 
#             location_doc = mongo.db.locations.find_one({"lid": location_lid})
#             if location_doc:
#                 request_location = {
#                     "coordinates": location_doc["coordinates"], 
#                     "location_lid": location_doc["lid"] 
#                 }
#                 return jsonify(request_location)
#             else:
#                 return jsonify(error={"message": "Location not found in locations collection."})
#         else:
#             return jsonify(error={"message": "Request does not have a location field or request not found."})
#     except Exception as e:
#         return jsonify(error={"message": str(e)})


