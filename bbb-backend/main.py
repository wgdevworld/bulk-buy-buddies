import certifi
import json
from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_socketio import SocketIO
import pyrebase
import os
import sys
import secrets
from dotenv import load_dotenv, find_dotenv
import json

# Blueprint Imports
from user.user_app import user_blueprint
from messaging.Messaging import messaging_blueprint
from productrecs.ProductRecs import productRec_blueprint
from request.request import request_blueprint
from locations.locations import locations_blueprint
from products.products import products_blueprint

# Flask Configurations
app = Flask(__name__)
CORS(app)

# Constants file
CONSTANTS_FILENAME = os.path.join(os.path.dirname(__file__), '../bbb-shared/constants.json')
with open(CONSTANTS_FILENAME, 'r') as file:
    app.config['CONSTANTS'] = json.load(file)


# MongoDB Configuration
load_dotenv()
username = os.getenv('ATLAS_USR')
password = os.getenv('ATLAS_PWD')
app.config["MONGO_URI"] = f"mongodb+srv://{username}:{password}@atlascluster.zojbxi7.mongodb.net/bbb?retryWrites=true&w=majority"

# Pyrebase Configuration
pyrebase_config = app.config['CONSTANTS']['pyrebase-config']
pyrebase_config['apiKey'] = os.getenv('PYREBASE_API_KEY')
firebase = pyrebase.initialize_app(pyrebase_config)
app.config["FIREBASE_AUTH"] = firebase.auth()
app.config["PYREBASE_API_KEY"] = os.getenv('PYREBASE_API_KEY')
curr_user = None

# Initialize PyMongo
app.config["MONGO"]=PyMongo(app, tlsCAFile=certifi.where())

# API Functionality
socketio = SocketIO(app, cors_allowed_origins="*")
app.register_blueprint(messaging_blueprint)
app.register_blueprint(user_blueprint)
app.register_blueprint(request_blueprint)
app.register_blueprint(productRec_blueprint)
app.register_blueprint(locations_blueprint)
app.register_blueprint(products_blueprint)

@app.route('/')
def index():
    return "Hello from BulkBuyBuddies!"

# Make sure to call the function to register your socket events
from messaging.MessageSocket import register_socket_events
register_socket_events(socketio)

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)
