from flask import Flask, render_template, jsonify
import requests

app = Flask(__name__)

historial = []

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/random-dog")
def random_dog():
    url = "https://dog.ceo/api/breeds/image/random"
    response = requests.get(url).json()
    if response.get("status") == "success":
        historial.append(response["message"])
    return jsonify(response)

@app.route("/breeds")
def breeds():
    url = "https://dog.ceo/api/breeds/list/all"
    response = requests.get(url).json()
    return jsonify(response)

@app.route("/dog/<breed>")
def dog_by_breed(breed):
    url = f"https://dog.ceo/api/breed/{breed}/images/random"
    response = requests.get(url).json()
    if response.get("status") == "success":
        historial.append(response["message"])
    return jsonify(response)

@app.route("/historial")
def ver_historial():
    return jsonify({"historial": historial})

if __name__ == "__main__":
    app.run(debug=True)
