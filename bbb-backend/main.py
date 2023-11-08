from flask import Flask, session
from flask_session import Session
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_socketio import SocketIO
from Messaging import messaging_api
from dotenv import load_dotenv
from user.user_app import user
import os
import sys
import secrets

# Flask Configurations
app = Flask(__name__)

# MongoDB Configuration
load_dotenv()
username = os.getenv('ATLAS_USR')
password = os.getenv('ATLAS_PWD')
app.config["MONGO_URI"] = f"mongodb+srv://{username}:{password}@atlascluster.zojbxi7.mongodb.net/bbb?retryWrites=true&w=majority"

# Initialize PyMongo
app.config["MONGO"]=PyMongo(app)

# API Functionality
socketio = SocketIO(app, cors_allowed_origins="*")
app.register_blueprint(messaging_api)
app.register_blueprint(user)

# Optional: if you want to use a namespace
# from MessageSocket import PlaySocket
# socketio.on_namespace(PlaySocket('/play'))

@app.route('/')
def index():
    return "Hello from Flask!"

# Make sure to call the function to register your socket events
from MessageSocket import register_socket_events
register_socket_events(socketio)

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)
    # app.run(debug=True, port=5000)
