from flask import Flask, jsonify, request
from flask_cors import CORS
from bs4 import BeautifulSoup
import requests
from flask_pymongo import PyMongo

app = Flask(__name__)
CORS(app)
secrets = dotenv_values(".env")
app.config["MONGO_URI"] = f"mongodb+srv://{secrets['ATLAS_USR']}:{secrets['ATLAS_PWD']}@atlascluster.zojbxi7.mongodb.net/bbb?retryWrites=true&w=majority"

mongo = PyMongo(app)

BASE_URL = "https://www.costco.com/meat.html"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36"
}

def scrape_page(url):
    print('ℹ️ scraping page ' + url)
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()  
    soup = BeautifulSoup(response.content, 'html.parser')
    product_names = [link.text.strip() for link in soup.select('a[automation-id^="productDescriptionLink_"]')]
    product_prices = [tag.text.strip() for tag in soup.select('div[automation-id^="itemPriceOutput_"]')]
    product_images = [tag['src'] for tag in soup.select('img[automation-id^="productImageLink_"]') if tag.has_attr('src')]
    return product_names, product_prices, product_images

def extract_price(price_str):
    # Remove any dollar signs or commas
    cleaned_price_str = price_str.replace('$', '').replace(',', '')
    
    # Check if the string contains "through"
    if 'through' in cleaned_price_str:
        # Take the first value (the minimum) in the range
        cleaned_price_str = cleaned_price_str.split('through')[0].strip()
    
    # Convert to float
    return float(cleaned_price_str)

@app.route('/scrape')
def index():
    try:
        products_collection = mongo.db.products
        all_products = []
        page = 1

        while True:
            url = f"{BASE_URL}?currentPage={page}"
            product_names, product_prices, product_images = scrape_page(url)

            if not product_names:
                break

            for name, price_str, src in zip(product_names, product_prices, product_images):
                # Use the helper function to extract the price
                price = extract_price(price_str)

                criteria = {"name": name}
                new_values = {"$set": {"name": name, "price": price, "src": src, "type": "meat"}}

                products_collection.update_one(criteria, new_values, upsert=True)
                all_products.append({"name": name, "price": price, "src": src, "type": "meat"})

            page += 1

        return jsonify(products=all_products)
    except requests.RequestException as e:
        return jsonify(error=f"Request error: {str(e)}"), 500
    except Exception as e:
        return jsonify(error=f"An unexpected error occurred: {str(e)}"), 500



@app.route('/search', methods=['GET'])
def search():
    try:
        search_term = request.args.get('query', '').strip()

        min_price_str = request.args.get('min_price')
        max_price_str = request.args.get('max_price')
        category = request.args.get('category', 'meat')
        min_price = float(min_price_str) if min_price_str != "" else 0
        max_price = float(max_price_str) if max_price_str != "" else float('inf')

        query = {
            "name": {"$regex": search_term, "$options": "i"},
            "price": {"$gte": min_price, "$lte": max_price},
            "type": category
        }

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
