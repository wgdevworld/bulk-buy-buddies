import certifi
from flask import Flask, session
from flask_session import Session
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_socketio import SocketIO
import pyrebase
import os
import sys
import secrets
from dotenv import load_dotenv
import json

# Blueprint Imports
from user.user_app import user_blueprint
from messaging.Messaging import messaging_blueprint
from productrecs.ProductRecs import productRec_blueprint
from request import request_blueprint
from products import products_blueprint

# Flask Configurations
app = Flask(__name__)
CORS(app)

# MongoDB Configuration
load_dotenv()
username = os.getenv('ATLAS_USR')
password = os.getenv('ATLAS_PWD')
app.config["MONGO_URI"] = f"mongodb+srv://{username}:{password}@atlascluster.zojbxi7.mongodb.net/bbb?retryWrites=true&w=majority"


# PYREBASE Configuration
config = {
    'apiKey': os.getenv('PYREBASE_API_KEY'),
    'authDomain': "bbb-user-auth.firebaseapp.com",
    'projectId': "bbb-user-auth",
    'storageBucket': "bbb-user-auth.appspot.com",
    'messagingSenderId': "92265669892",
    'appId': "1:92265669892:web:a7c857ddd158df2d759c51",
    'measurementId': "G-WK22RJ84J3",
    'databaseURL': ""
}
firebase = pyrebase.initialize_app(config)
app.config["FIREBASE_AUTH"] = firebase.auth()
curr_user = None

app.config["PYREBASE_API_KEY"] = os.getenv('PYREBASE_API_KEY')

with open('../bbb-shared/constants.json', 'r') as file:
    app.config['CONSTANTS'] = json.load(file)

# Initialize PyMongo
app.config["MONGO"]=PyMongo(app, tlsCAFile=certifi.where())

# API Functionality
socketio = SocketIO(app, cors_allowed_origins="*")
app.register_blueprint(messaging_blueprint)
app.register_blueprint(user_blueprint)
app.register_blueprint(request_blueprint)
app.register_blueprint(productRec_blueprint)
app.register_blueprint(products_blueprint)

@app.route('/')
def index():
    return "Hello from BulkBuyBuddies!"

# Make sure to call the function to register your socket events
from messaging.MessageSocket import register_socket_events
register_socket_events(socketio)

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)
