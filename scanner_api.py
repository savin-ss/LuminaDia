import os

# 🔧 FIX WINDOWS CACHE PERMISSION ERROR
os.environ["TORCH_HOME"] = os.path.join(os.getcwd(), "torch_cache")
os.environ["HF_HOME"] = os.path.join(os.getcwd(), "hf_cache")
os.environ["XDG_CACHE_HOME"] = os.path.join(os.getcwd(), "cache")

from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from working_scanner import WorkingScanner

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs("torch_cache", exist_ok=True)
os.makedirs("hf_cache", exist_ok=True)
os.makedirs("cache", exist_ok=True)

app = Flask(__name__)
scanner = WorkingScanner()

@app.route("/scan", methods=["POST"])
def scan():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files["image"]
    filename = secure_filename(file.filename)
    path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(path)

    result = scanner.perform_scan(path)

    return jsonify(result)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
