from flask import Flask, jsonify, request
from flask_cors import CORS
from bs4 import BeautifulSoup
import requests
from flask_pymongo import PyMongo
from pymongo.errors import PyMongoError
import os
from dotenv import dotenv_values
import re
from enum import Enum
from requests.exceptions import HTTPError
import json

app = Flask(__name__)
CORS(app)
secrets = dotenv_values(".env")
app.config["MONGO_URI"] = f"mongodb+srv://{secrets['ATLAS_USR']}:{secrets['ATLAS_PWD']}@atlascluster.zojbxi7.mongodb.net/bbb?retryWrites=true&w=majority"

mongo = PyMongo(app)

BASE_URL = f"https://www.costco.com/"

headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9",
    "Connection": "keep-alive",
    "Content-Type": "application/json",
    "Referer": BASE_URL,
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Host": "www.costco.com"
}

with open('../../bbb-shared/constants.json', 'r') as file:
    constants = json.load(file)

Warehouses = constants['warehouses']
categories_dict = constants['categories']

@app.route('/insert-categories', methods=['GET'])
def scrape_categories():
    categories_collection = mongo.db.categories
    for category in categories_dict:
        print('ℹ️ Scraping category' + category)
        subcategory_document = {
            'name': category,
            'link': categories_dict[category][0],
            'unit': categories_dict[category][1]
        }
        categories_collection.update_one(
            {'name': category},
            {'$set': subcategory_document},
            upsert=True
        )
    return "Categories scraping is done!"


def convert_to_pounds(quantity, unit):
    unit = unit.lower()
    if unit == 'lb':
        return quantity
    elif unit == 'oz':
        return quantity / 16.0
    elif unit == 'kg':
        return quantity * 2.20462
    elif unit == 'g':
        return quantity / 453.592
    else:
        return None

def scrape_page(session, url, page=1):
    url = f"{url}?currentPage={page}"
    print('ℹ️ scraping page ' + url)
    try:
        response = session.get(url)
        response.raise_for_status()
    except HTTPError as e:
        if e.response.status_code == 404:
            print(f"⚠️ Page not found: {url}. Skipping category.")
            return [], [], []
        else:
            raise 
    soup = BeautifulSoup(response.content, 'html.parser')
    
    product_names = [link.text.strip() for link in soup.select('a[automation-id^="productDescriptionLink_"]')]
    product_prices = [tag.text.strip() for tag in soup.select('div[automation-id^="itemPriceOutput_"]')]
    product_images = [tag['src'] for tag in soup.select('img[automation-id^="productImageLink_"]') if tag.has_attr('src')]
    return product_names, product_prices, product_images

def extract_price(price_str):
    cleaned_price_str = price_str.replace('$', '').replace(',', '')
    if 'through' in cleaned_price_str:
        cleaned_price_str = cleaned_price_str.split('through')[0].strip()
    return float(cleaned_price_str)

def update_products_in_db(products_collection, product, warehouse_id):
    try:
        update_operations = {
            "$set": product,
            "$addToSet": {"locations": {"$each": [warehouse_id]}}
        }
        
        result = products_collection.update_one(
            {"name": product["name"]},
            update_operations,
            upsert=True 
        )

        if result.upserted_id is not None:
            print(f"Inserted a new product with id: {result.upserted_id}")
        else:
            print(f"Updated an existing product; matched count: {result.matched_count}")

    except PyMongoError as e:
        print(f"Database operation failed: {e}")


@app.route('/scrape-products', methods=['GET'])
def index():
    products_collection = mongo.db.products
    all_products = []
    scraped_products_names = set()
    
    for warehouse in Warehouses:
        print(f"Scraping location {warehouse} with ID {Warehouses[warehouse]}")
        with requests.Session() as session:
            session.headers.update(headers)
            warehouse_update_url = f"https://www.costco.com/AjaxWarehouseUpdateCmd?warehouseId={Warehouses[warehouse]}"
            try:
                session.get(warehouse_update_url, timeout=10)
            except requests.RequestException as e:
                return jsonify(error=f"Failed to set warehouse: {str(e)}"), 500
            
            for category in categories_dict:
                category_path, regex_pattern = categories_dict[category]
                print(f"Scraping category {category}")
                BASE_URL = f"https://www.costco.com/{category_path}.html"
                page = 1
                while True:
                    product_names, product_prices, product_images = scrape_page(session, BASE_URL, page)
                    if not product_names:
                        break
                    
                    for name, price_str, src in zip(product_names, product_prices, product_images):
                        price = extract_price(price_str)

                        unit_pattern = fr'(?i)(\d+\.?\d+|\d+)[-\s]*({regex_pattern})'

                        match = re.search(unit_pattern, name)
                        if 'lb' in regex_pattern and match:
                            quantity_value = float(match.group(1))
                            unit = match.group(2).lower()
                            quantity = convert_to_pounds(quantity_value, unit)
                            print(quantity)
                        elif 'count' in regex_pattern and match:
                            quantity = float(match.group(1))
                            print(quantity)
                        else:
                            quantity = None
                        if (quantity != None): 
                            product_data = {
                                "name": name, 
                                "price": extract_price(price_str), 
                                "src": src, 
                                "category": category,
                                "quantity": quantity,
                            }
                            update_products_in_db(products_collection, product_data, Warehouses[warehouse])
                            scraped_products_names.add(name)
                            all_products.append(product_data)
                    page += 1

        all_products_in_db = products_collection.find({"locations": Warehouses[warehouse]}, {"name": 1})
        for product in all_products_in_db:
            if product["name"] not in scraped_products_names:
                products_collection.update_one({"name": product["name"]}, {"$pull": {"locations": Warehouses[warehouse]}})
    return jsonify(products=all_products)

@app.route('/search', methods=['GET'])
def search():
    try:
        search_term = request.args.get('query', '').strip()

        min_price_str = request.args.get('min_price')
        max_price_str = request.args.get('max_price')
        category = request.args.get('category')
        min_price = float(min_price_str) if min_price_str != "" else 0
        max_price = float(max_price_str) if max_price_str != "" else float('inf')

        query = {
            "name": {"$regex": search_term, "$options": "i"},
            "price": {"$gte": min_price, "$lte": max_price},
        }
        if (category) :
            query["category"] = category

        products = list(mongo.db.products.find(query))

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
