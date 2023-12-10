from flask import Flask, jsonify, Blueprint, current_app
import requests
from flask_cors import CORS
from flask_pymongo import PyMongo
import os
from bson import ObjectId
from dotenv import load_dotenv, find_dotenv

# Load environment variables
load_dotenv(find_dotenv())

# Get Google Maps API key from environment
google_maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")

# Create a Blueprint for locations-related routes
locations_blueprint = Blueprint('locations_blueprint', __name__)

# Route to get a list of locations
@locations_blueprint.route('/get_locations', methods=['GET'])
def get_locations():
    try:
        # Get MongoDB instance from current app configuration
        mongo = current_app.config['MONGO']
        locations_collection = mongo.db.locations
        locations_list = []

        # Retrieve and format location data
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

# Route to get a user's geocoded location
@locations_blueprint.route('/get_user_location/<user_id>', methods=['GET'])
def get_user_location(user_id):
    try:
        # Get MongoDB instance from current app configuration
        mongo = current_app.config['MONGO']
        users_collection = mongo.db.users
        user = users_collection.find_one({"uid": user_id})

        # Check if user exists and has an address
        if user and 'address' in user:
            user_address = user['address']

            # Geocode the user's address using Google Maps API
            geocoding_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={user_address}&key={google_maps_api_key}"
            response = requests.get(geocoding_url)

            if response.status_code == 200:
                data = response.json()

                # Extract location coordinates and return
                if "location" in data['results'][0]['geometry']:
                    location = data['results'][0]['geometry']['location']
                    return jsonify(location)
                else:
                    return jsonify(error={"message": "Could not geocode address."})
            else:
                return jsonify(error={"message": "Geocoding API request failed."})

        return jsonify(error={"message": "User address not found."})
    except Exception as e:
        return jsonify(error={"message": str(e)})

# Route to get the name of a location by its ID
@locations_blueprint.route('/get_location_name/<location_id>', methods=['GET'])
def get_location_name(location_id):
    try:
        # Get MongoDB instance from current app configuration
        mongo = current_app.config['MONGO']
        locations_collection = mongo.db.locations
        location = locations_collection.find_one({"lid": location_id})

        # Check if location exists and return its name
        if location:
            location_name = location['name']
            return jsonify(location_name)

        return jsonify(error={"message": "Location not found."})
    except Exception as e:
        return jsonify(error={"message": str(e)})
