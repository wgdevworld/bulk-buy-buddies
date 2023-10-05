from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from flask_pymongo import PyMongo
import os
from dotenv import dotenv_values

app = Flask(__name__)
CORS(app)
secrets = dotenv_values(".env")
app.config["MONGO_URI"] = f"mongodb+srv://{secrets['ATLAS_USR']}:{secrets['ATLAS_PWD']}@atlascluster.zojbxi7.mongodb.net/bbb"

mongo = PyMongo(app)

@app.route("/fetchSimilarProducts", methods=['GET'])
def fetchBestProduct():
    try:
        category_str = request.args.get('userCategory')
        print(category_str)
        print(type(category_str))
        user_quantity_str = request.args.get('userQuantity')
        buddy_quantity_str = request.args.get('buddyQuantity')
        user_quantity = int(user_quantity_str)
        buddy_quantity = int(buddy_quantity_str)
        desired_quantity = user_quantity + buddy_quantity
        lower_bound = int(desired_quantity*0.8)
        upper_bound = int(desired_quantity*1.2)
        print('ok!')
        products = list(mongo.db.product.find({'category':category_str,'quantity':{'$lte':upper_bound,'$gte':lower_bound}}))
        # products = list(mongo.db.product.find({"category":category_str,"quantity":{'$ne': None,'$lte':upper_bound,'gte':lower_bound}}))
        print('0k')
        results = []
        for product in products:
            product['_id'] = str(product['_id'])
            results.append(product)
    
        return jsonify(results=results)
    except ValueError:
        return jsonify(error="Invalid value provided for price"), 400
    except Exception as e:
        return jsonify(error=f"An unexpected error occurred: {str(e)}"), 500

if __name__ == '__main__':
    app.run(port=5000)