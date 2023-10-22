from flask import Flask, jsonify, request, Blueprint
from flask_cors import CORS
from flask_pymongo import PyMongo
import os
from dotenv import load_dotenv, find_dotenv

app = Flask(__name__)
CORS(app, origins='http://127.0.0.1:5000')

app = Flask(__name__)
CORS(app)
secrets = dotenv_values(".env")
app.config["MONGO_URI"] = f"mongodb+srv://{secrets['ATLAS_USR']}:{secrets['ATLAS_PWD']}@atlascluster.zojbxi7.mongodb.net/bbb?retryWrites=true&w=majority"

mongo = PyMongo(app)

@app.route('/get_locations', methods=['GET'])
def get_my_requests():
    try: 
        request_collection = mongo.db.requests
        # request_list = []
        return jsonify(request_collection)
    except Exception as e:
        return jsonify(error={"message": str(e)})

if __name__ == '__main__':
    app.run(port=5000)
    




