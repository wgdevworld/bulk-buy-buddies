from flask import Flask, request, jsonify, Blueprint, current_app
from user_model import User
from flask_cors import CORS
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import certifi

user = Blueprint('user', __name__)
app = Flask(__name__)
CORS(app)
# app.config["MONGO_URI"] = "mongodb+srv://czfrance:bbb2024DUKE@atlascluster.zojbxi7.mongodb.net/bbb?retryWrites=true&w=majority"
app.config["MONGO_URI"] = "mongodb+srv://czfrance:bbb2024DUKE@atlascluster.zojbxi7.mongodb.net/bbb"
# app.config["MONGO_URI"] = "mongodb+srv://czfrance:bbb2024DUKE@atlascluster.zojbxi7.mongodb.net/"
mongo = PyMongo(app,tlsCAFile=certifi.where())
users = mongo.db.users

@user.route("/register", methods=['POST'])
def register():
    try:
        registration_info = request.get_json()
        
        user = {
            "id": uuid.uuid4().hex,
            "firstname": registration_info['firstname'],
            "firstname": registration_info['lastname'],
            "email": registration_info['email'],
            "password": generate_password_hash(registration_info['password'])
        }

        if users.find_one({"email": user["email"]}):
            return jsonify({"error": "Already a user with this email"}), 200

        if users.insert_one(user):
            del user['_id']
            return jsonify(user), 200
        
        return jsonify({"error": "Failed to sign up"}), 200
    
        # result = User.email_exists(registration_info['email'])
        # if result:
        #     return jsonify({"error": "email address is already in use"})

        # else:
        # user = User.register(registration_info['firstname'], registration_info['lastname'],
        #                     registration_info['username'], registration_info['password'])
        # print(user)
        # return jsonify({"user": user})

    except ValueError as e:
        return jsonify(error="Invalid value provided"), 400
    except Exception as e:
        print("exception")
        print(f'Exception: {e}')
        return jsonify(error=str(e)), 500