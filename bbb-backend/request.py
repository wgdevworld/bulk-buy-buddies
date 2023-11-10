from flask import Blueprint, Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from dotenv import dotenv_values

request = Blueprint('request', __name__)
app = Flask(__name__)
CORS(app)
secrets = dotenv_values(".env")
app.config["MONGO_URI"] = f"mongodb+srv://{secrets['ATLAS_USR']}:{secrets['ATLAS_PWD']}@atlascluster.zojbxi7.mongodb.net/bbb?retryWrites=true&w=majority"

mongo = PyMongo(app)

@app.route('/shopping-request', methods=['POST'])
def submit_shopping_request():
    try:
        data = request.json
        request_collection = mongo.db.requests
        request_collection.insert_one(data)
        return jsonify({'message': 'Shopping request submitted successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to process the request'}), 500


@app.route('/get-requests', methods=['GET'])
def get_my_requests():
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

if __name__ == '__main__':
    app.run(port=5000)
