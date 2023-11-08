from flask import Flask, request, jsonify, Blueprint
# from user_model import User
from flask_cors import CORS
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import certifi
from dotenv import dotenv_values

user = Blueprint('user', __name__)
app = Flask(__name__)
# secrets = dotenv_values('.env')  #ends up being empty?
CORS(app)
# app.config["MONGO_URI"] = f"mongodb+srv://{secrets['ATLAS_USR']}:{secrets['ATLAS_PWD']}@atlascluster.zojbxi7.mongodb.net/bbb"
app.config["MONGO_URI"] = "mongodb+srv://czfrance:bbb2024DUKE@atlascluster.zojbxi7.mongodb.net/bbb"
mongo = PyMongo(app,tlsCAFile=certifi.where())
users = mongo.db.users

@user.route("/register", methods=['POST'])
def register():
    try:
        registration_info = request.get_json()
        user = {
            "id": uuid.uuid4().hex,
            "firstname": registration_info['firstname'],
            "lastname": registration_info['lastname'],
            "email": registration_info['email'],
            "password": generate_password_hash(registration_info['password'])
        }

        if users.find_one({"email": user["email"]}):
            print("Already a user with this email")
            return jsonify({"error": "Already a user with this email"}), 400

        if users.insert_one(user):
            del user['_id']
            return jsonify(user), 200
        
        return jsonify({"error": "Failed to sign up"}), 400
    
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


@user.route("/login", methods=['POST'])
def login():
    try:
        login_info = request.get_json()
        user = users.find_one({"email": login_info['email']})
        if not user:
            print("incorrect email")
            return jsonify({"error": "Incorrect email"}), 400

        elif not check_password_hash(user['password'], login_info['password']):
            print("incorrect password")
            return jsonify({"error": "Incorrect password"}), 400

        del user['_id']
        return jsonify(user), 200
        
    except ValueError as e:
        return jsonify(error="Invalid value provided"), 400
    except Exception as e:
        print("exception")
        print(f'Exception: {e}')
        return jsonify(error=str(e)), 500