from flask import Flask
from Messaging import messaging_api
import os
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_socketio import SocketIO, Namespace
from dotenv import load_dotenv
# from MessageSocket import message_socket 


# Flask Configurations
app = Flask(__name__)
CORS(app)

# MongoDB Configuration
load_dotenv()
username = os.getenv('ATLAS_USR')
password = os.getenv('ATLAS_PWD')
app.config["MONGO_URI"] = f"mongodb+srv://{username}:{password}@atlascluster.zojbxi7.mongodb.net/bbb?retryWrites=true&w=majority"
app.config["MONGO"] = PyMongo(app)

# API Functionality
# socketio = SocketIO(app)
app.register_blueprint(messaging_api)

@app.route('/')
def index():
    return "Hello from Flask!"
# class PlaySocket(Namespace):
#     def on_connect(self):
#         print("Client connected")

#     def on_disconnect(self):
#         print("Client disconnected")

# socket configs
# socketio.on_namespace(message_socket)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
