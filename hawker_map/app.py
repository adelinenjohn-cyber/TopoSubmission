from flask import Flask, render_template, jsonify
import json
import os

app = Flask(__name__)

# Get the full path to hawkers.geojson
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "hawkers.geojson")


def load_hawkers():
    with open(DATA_FILE, "r", encoding="utf-8") as f: # reading the geojson file
        data = json.load(f)
    return data.get("features", [])


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/hawkers")
def api_hawkers():
    hawkers = load_hawkers()
    return jsonify(hawkers) # sending hawker data for js to use


if __name__ == "__main__":
    app.run(debug=True)