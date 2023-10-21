from flask import Flask, jsonify, request
from flask_cors import CORS
from bs4 import BeautifulSoup
import requests
from flask_pymongo import PyMongo
import os
from dotenv import dotenv_values
import re

app = Flask(__name__)
CORS(app)
secrets = dotenv_values(".env")
app.config["MONGO_URI"] = f"mongodb+srv://{secrets['ATLAS_USR']}:{secrets['ATLAS_PWD']}@atlascluster.zojbxi7.mongodb.net/bbb?retryWrites=true&w=majority"

mongo = PyMongo(app)


# RALEIGH: 645
# APEX: 1206
# DURHAM: 249

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


def scrape_page(session, url, page=1):
    url = f"{url}?currentPage={page}"
    print('ℹ️ scraping page ' + url)
    response = session.get(url)
    response.raise_for_status()
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

@app.route('/scrape/<category>/<location>')
def index(category, location):
    print(f"Entered scrape route with category {category} and location {location}")
    BASE_URL = f"https://www.costco.com/{category}.html"
    try:
        with requests.Session() as session:
            session.headers.update(headers)

            warehouse_update_url = f"https://www.costco.com/AjaxWarehouseUpdateCmd?warehouseId={location}"
            response = session.get(warehouse_update_url, timeout=10)
            response.raise_for_status()

            products_collection = mongo.db.products
            all_products = []
            page = 1
            scraped_products_names = set()

            while True:
                product_names, product_prices, product_images = scrape_page(session, BASE_URL, page)

                if not product_names:
                    break

                for name, price_str, src in zip(product_names, product_prices, product_images):
                    price = extract_price(price_str)
                    scraped_products_names.add(name)

                    match = re.search(r'(?i)(\d+(\.\d+)?)\s*lb\.?', name)
                    if match:
                        quantity = float(match.group(1))
                    else:
                        quantity = None

                    criteria = {"name": name}
                    new_values = {
                        "$set": {
                            "name": name, 
                            "price": price, 
                            "src": src, 
                            "category": category,
                            "quantity": quantity 
                        },
                        "$addToSet": {
                            "locations": location
                        }
                    }

                    products_collection.update_one(criteria, new_values, upsert=True)
                    all_products.append({
                        "name": name, 
                        "price": price, 
                        "src": src, 
                        "category": category,
                        "quantity": quantity,
                        "locations": [location]
                    })
                page += 1

        all_products_in_db = products_collection.find({"locations": location}, {"name": 1})
        for product in all_products_in_db:
            if product["name"] not in scraped_products_names:
                products_collection.update_one({"name": product["name"]}, {"$pull": {"locations": location}})

        return jsonify(products=all_products)
    except requests.RequestException as e:
        return jsonify(error=f"Request error: {str(e)}"), 500
    except requests.Timeout:
        return jsonify(error="Request timed out"), 500
    except Exception as e:
        return jsonify(error=f"An unexpected error occurred: {str(e)}"), 500




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
