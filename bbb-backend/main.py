from flask import Flask
from Messaging import messaging_api
import os
from flask_cors import CORS
from flask_pymongo import PyMongo
from dotenv import dotenv_values
from dotenv import load_dotenv


MY_ENV_VAR = os.getenv('MY_ENV_VAR')


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
app.register_blueprint(messaging_api)

@app.route('/')
def index():
    return "Hello from Flask!"

if __name__ == '__main__':
    app.run(debug=True, port=5000)
