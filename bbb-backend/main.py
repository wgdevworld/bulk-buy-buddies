from flask import Flask
from Messaging import messaging_api
import sys
from user.user_app import user
from flask_cors import CORS
from flask_pymongo import PyMongo

# Flask Configurations
app = Flask(__name__)
CORS(app)

# MongoDB Configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/bbb"
app.config["MONGO"] = PyMongo(app) 

# API Functionality
app.register_blueprint(messaging_api)
app.register_blueprint(user)

@app.route('/')
def index():
    return "Hello from Flask!"

if __name__ == '__main__':
    app.run(port=5000)
