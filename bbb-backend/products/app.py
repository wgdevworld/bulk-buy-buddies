from flask import Flask, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup
import requests
from flask_pymongo import PyMongo

app = Flask(__name__)
CORS(app)
app.config["MONGO_URI"] = "mongodb://localhost:27017/costcomeat"
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

            for name, price, src in zip(product_names, product_prices, product_images):
                criteria = {"name": name}

                new_values = {"$set": {"name": name, "price": price, "src": src}}

                products_collection.update_one(criteria, new_values, upsert=True)
                all_products.append({"name": name, "price": price, "src": src})

            page += 1

        return jsonify(products=all_products)
    except requests.RequestException as e:
        return jsonify(error=f"Request error: {str(e)}"), 500
    except Exception as e:
        return jsonify(error=f"An unexpected error occurred: {str(e)}"), 500

if __name__ == '__main__':
    app.run(port=5000)
