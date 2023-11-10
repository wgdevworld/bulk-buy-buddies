from flask import Flask, session
from Messaging import messaging_api
import sys
from user.user_app import user
from flask_cors import CORS
from flask_pymongo import PyMongo
import secrets
from request import requests_api
from locations.locations import locations_api
from dotenv import load_dotenv, find_dotenv
import os


load_dotenv (find_dotenv())
username = os.getenv("MONGODB_USER")
password = os.getenv("MONGODB_PWD")
# Flask Configurations
app = Flask(__name__)
# app.secret_key = secrets.token_urlsafe(16)
# app.config.update(SESSION_COOKIE_SAMESITE="None", SESSION_COOKIE_SECURE=True)
# app.config["SESSION_PERMANENT"] = False
# app.config["SESSION_TYPE"] = "filesystem"
# app.config.from_object(__name__)
# Session(app)
CORS(app, supports_credentials=True)

# MongoDB Configuration
app.config["MONGO_URI"] = f"mongodb+srv://{username}:{password}@atlascluster.zojbxi7.mongodb.net/bbb"
app.config["MONGO"] = PyMongo(app) 

# API Functionality
app.register_blueprint(messaging_api)
app.register_blueprint(user)
app.register_blueprint(requests_api)
app.register_blueprint(locations_api)

@app.route('/')
def index():
    return "Hello from Flask!"

if __name__ == '__main__':
    app.run(port=5000)
