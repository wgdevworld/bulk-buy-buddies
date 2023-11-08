from flask import Flask, session
from flask_session import Session
from Messaging import messaging_api
import sys
from user.user_app import user
from flask_cors import CORS
from flask_pymongo import PyMongo
import secrets

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
