from flask import Flask, jsonify, request, Blueprint
from flask_cors import CORS
from flask_pymongo import PyMongo
import os
from dotenv import load_dotenv, find_dotenv

app = Flask(__name__)
CORS(app, origins='http://127.0.0.1:5000')

load_dotenv (find_dotenv())
password = os.getenv("MONGODB_PWD")
app.config["MONGO_URI"] = f"mongodb+srv://justinyang:{password}@atlascluster.zojbxi7.mongodb.net/bbb?retryWrites=true&w=majority"

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


# @app.route('/insert_location', methods=['POST'])
# def insert_location():
#     locations_collection = mongo.db.locations
#     locations_data = request.get_json()
#     locations_collection.insert_one(locations_data)
#     return jsonify(locations_data)


if __name__ == '__main__':
    app.run(port=5000)
    




