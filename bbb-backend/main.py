from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_pymongo import PyMongo
import sys
import os
from dotenv import load_dotenv, find_dotenv


app = Flask(__name__)
CORS(app)

# app.config["MONGO_URI"] = "mongodb://localhost:27017/bbb"
# app.config["MONGO"]=PyMongo(app)



print(sys.path)

@app.route('/')
def index():
    return "Hello World!"
    


if __name__ == '__main__':
    app.run(port=5000)
    
