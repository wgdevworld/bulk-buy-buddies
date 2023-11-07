from flask import Flask, request, jsonify, Blueprint, session, make_response
# from flask_session import Session
# from user_model import User
from flask_cors import CORS
from flask_pymongo import PyMongo
import certifi
from dotenv import dotenv_values, load_dotenv, find_dotenv
import pyrebase
from datetime import datetime
import json
import os

user = Blueprint('user', __name__)
app = Flask(__name__)
load_dotenv(find_dotenv())

CORS(app, supports_credentials=True)
app.config["MONGO_URI"] = f"mongodb+srv://{os.getenv('ATLAS_USR')}:{os.getenv('ATLAS_PWD')}@atlascluster.zojbxi7.mongodb.net/bbb"
mongo = PyMongo(app,tlsCAFile=certifi.where())
users = mongo.db.users
config = {
    'apiKey': "AIzaSyCQUBL56XsmpCkkOcn0It4770zC47ADgRM",
    'authDomain': "bbb-user-auth.firebaseapp.com",
    'projectId': "bbb-user-auth",
    'storageBucket': "bbb-user-auth.appspot.com",
    'messagingSenderId': "92265669892",
    'appId': "1:92265669892:web:a7c857ddd158df2d759c51",
    'measurementId': "G-WK22RJ84J3",
    'databaseURL': ""
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()

curr_user = None

def get_user():
    global curr_user
    return curr_user

@user.route('/retrieve_locations_temp', methods=['GET'])
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

@user.route("/register", methods=['POST'])
def register():
    print("\nREGISTER")
    global curr_user
    try:
        registration_info = request.get_json()
        result = users.find_one({"email": registration_info['email']})

        if result is not None:
            print("Already a user with this email")
            return jsonify({"error": "Already a user with this email"}), 400
        
        try:
            firebase_user = auth.create_user_with_email_and_password(registration_info['email'], registration_info['password'])

        except Exception as e:
            error_json = e.args[1]
            error = json.loads(error_json)['error']['message']
            print(error)
            return jsonify({"error": error}), 400

        user = {
            "uid": firebase_user.get('localId'),
            "firstname": registration_info['firstname'],
            "lastname": registration_info['lastname'],
            "email": registration_info['email'],
            "dateJoined": str(datetime.now()),
            "location": registration_info.get('location', None)
        }

        try:
            curr_user = dict(user)
            curr_user['idToken'] = firebase_user['idToken']
            curr_user['refreshToken'] = firebase_user['refreshToken']
            # session['user'] = curr_user

        except Exception as e:
            # print("error adding user to session")
            auth.delete_user_account(curr_user['idToken'])
            return jsonify(error=str(e)), 500

        if users.insert_one(user):
            del user['_id']
            # resp = make_response(user)
            # resp.set_cookie('uid', value=user['id'], domain='127.0.0.1:3000')
            # return resp, 200
            return jsonify(user), 200
        
        auth.delete_user_account(curr_user['idToken'])
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
        print(f'Exception: {e}')
        return jsonify(error=str(e)), 500


@user.route("/login", methods=['POST'])
def login():
    print("\nLOGIN")
    global curr_user
    try:
        # print(session)
        # print(session.get('user'))
        login_info = request.get_json()
        user = users.find_one({"email": login_info['email']})
        if not user:
            print("incorrect email")
            return jsonify({"error": "Incorrect email"}), 400

        try:
            firebase_user = auth.sign_in_with_email_and_password(user['email'], login_info['password'])
            del user['_id']

            curr_user = dict(user)
            curr_user['idToken'] = firebase_user['idToken']
            curr_user['refreshToken'] = firebase_user['refreshToken']
            # session['user'] = curr_user
            # print(session.get('user'))

            # resp = make_response(user)
            # resp.set_cookie('uid', value=user['id'], domain='127.0.0.1:3000')
            # return resp, 200
            return jsonify(user), 200
        except Exception as e:
            print(e)
            print("incorrect password")
            return jsonify({"error": "Incorrect password"}), 400
        # elif not check_password_hash(user['password'], login_info['password']):
        #     print("incorrect password")
        #     return jsonify({"error": "Incorrect password"}), 400

        # del user['_id']
        # return jsonify(user), 200
        
    except ValueError as e:
        return jsonify(error="Invalid value provided"), 400
    except Exception as e:
        print(f'Exception: {e}')
        return jsonify(error=str(e)), 500
    

@user.route("/logout", methods=['POST'])
def logout():
    global curr_user
    try:
        print("\nLOGOUT")
        # print(session)
        # print(session.get('user'))
        temp_user = dict(curr_user)
        # print(temp_user)
        # session.pop('user')
        # print("sucessfully popped")
        auth.current_user = None
        curr_user = None
        print('successfully logged out')
        return jsonify(temp_user), 200

    except Exception as e:
        print("exception")
        print(f'Exception: {e}')
        return jsonify(error=str(e)), 500
    
@user.route("/reset_password", methods=['POST'])
def reset_password():
    print("\nRESET PASSWORD")
    global curr_user
    try:
        user_info = request.get_json()
        result = users.find_one({"email": user_info['email']})

        if result is None:
            print("No account associated with this email")
            return jsonify({"error": "No account associated with this email"}), 400
        
        try:
            auth.send_password_reset_email(user_info['email'])
            return jsonify(user_info), 200

        except Exception as e:
            error_json = e.args[1]
            error = json.loads(error_json)['error']['message']
            print(error)
            return jsonify({"error": error}), 400

    except ValueError as e:
        return jsonify(error="Invalid value provided"), 400
    except Exception as e:
        print(f'Exception: {e}')
        return jsonify(error=str(e)), 500
    
@user.route("/get_acct_info", methods=['GET'])
def get_acct_info():
    print("\nACCOUNT INFO")
    global curr_user
    try:
        return jsonify(get_user()), 200
    
    except Exception as e:
        print(f'Exception: {e}')
        return jsonify(error=str(e)), 500
    

@user.route("/get_transactions", methods=['GET'])
def get_transactions():
    print("\nTRANSACTIONS")
    global curr_user

    try: 
        requests_collection = mongo.db.requests
        transactions = []
        results = requests_collection.find({"uid": curr_user['uid']})
        print(results)
        for transaction in requests_collection.find({"uid": curr_user['uid']}):
            transaction["_id"] = str(transaction["_id"])
            transactions.append(transaction)

        return jsonify(transactions)
    except Exception as e:
        print(str(e))
        return jsonify(error={"message": str(e)})
    

@user.route("/updateAccount", methods=['POST'])
def updateAccount():
    print("\nUPDATE ACCOUNT")
    global curr_user
    try:
        new_info = request.get_json()
        print(new_info['firstname'])
        if new_info['firstname'] == "":
            return jsonify(error="first name cannot be empty"), 500
        elif new_info['lastname'] == "":
            return jsonify(error="last name cannot be empty"), 500
        elif new_info['location'] == "":
            return jsonify(error="location cannot be empty"), 500
        
        try:
            user = users.update_one({"uid": curr_user['uid']},
                                    {
                                        '$set': {
                                            'firstname': new_info['firstname'],
                                            'lastname': new_info['lastname'],
                                            'location': new_info['location'],
                                        }
                                    })
            
            curr_user['firstname'] = new_info['firstname']
            curr_user['lastname'] = new_info['lastname']
            curr_user['location'] = new_info['location']

            return jsonify({'result': "success"}), 200
        except Exception as e:
            print("error updating user info")
            return jsonify(error=str(e)), 500

    except ValueError as e:
        return jsonify(error="Invalid value provided"), 400
    except Exception as e:
        print(f'Exception: {e}')
        return jsonify(error=str(e)), 500
    

def refreshToken():
    global curr_user
    # curr_user = session.get('user')
    refresh_user = auth.refresh(curr_user['refreshToken'])
    curr_user['idToken'] = refresh_user['idToken']
    curr_user['refreshToken'] = refresh_user['refreshToken']

    session['user'] = curr_user