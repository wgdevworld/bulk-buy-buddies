from flask import Flask

app = Flask(__name__)

import sys
print(sys.path)

@app.route('/')
def index():
    return "Hello from Flask!"

if __name__ == '__main__':
    app.run(port=5000)