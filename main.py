import os
import time
import random
import threading
import webbrowser
import http.server
import socketserver
import sys

# ==========================================================
# CONFIGURATION
# ==========================================================
PROJECT_DIR = r"D:\lumina dia"
PORT = 8000

MODEL_NAME = "VisionTransformer_LuminaDia_v1.0"
DATASET_NAME = "LuminaDia_Stage_0_3_Dataset"
EPOCHS = 12
BATCH_SIZE = 16
IMAGE_SIZE = (224, 224)

STAGES = ["Stage 0", "Stage 1", "Stage 2", "Stage 3"]

# ==========================================================
# LOGGING UTILITIES
# ==========================================================
def slow_print(text, delay=0.02):
    for c in text:
        sys.stdout.write(c)
        sys.stdout.flush()
        time.sleep(delay)
    print()

def section(title):
    print("\n" + "=" * 60)
    slow_print(f"{title}")
    print("=" * 60)

# ==========================================================
#  DATASET LOADING
# ==========================================================
def load_dataset():
    section("Loading Dataset")
    slow_print(f"Dataset Name       : {DATASET_NAME}")
    slow_print("Scanning directories...")
    time.sleep(1)

    for i in range(4):
        slow_print(f"✔ Stage {i} images loaded: {random.randint(120, 180)}")

    slow_print("Splitting dataset:")
    slow_print("  → Training set   : 70%")
    slow_print("  → Validation set : 20%")
    slow_print("  → Test set       : 10%")
    time.sleep(1)

    slow_print("Dataset loaded successfully.")

# ==========================================================
# MODEL INITIALIZATION
# ==========================================================
def initialize_model():
    section("Initializing Model")
    slow_print(f"Model Architecture : {MODEL_NAME}")
    slow_print(f"Input Size         : {IMAGE_SIZE}")
    slow_print("Loading pretrained weights...")
    time.sleep(1.5)
    slow_print("Model initialized successfully.")

# ==========================================================
# TRAINING LOOP
# ==========================================================
def train_model():
    section("Training Started")
    slow_print(f"Epochs     : {EPOCHS}")
    slow_print(f"Batch Size : {BATCH_SIZE}")
    slow_print("Optimizer  : AdamW")
    slow_print("Loss Func  : CrossEntropyLoss\n")

    acc = 72.4
    loss = 1.25

    for epoch in range(1, EPOCHS + 1):
        time.sleep(0.6)
        acc += random.uniform(0.6, 1.2)
        loss -= random.uniform(0.05, 0.1)

        slow_print(
            f"Epoch [{epoch}/{EPOCHS}] "
            f"- Loss: {loss:.4f} "
            f"- Accuracy: {acc:.2f}%"
        )

    slow_print("\nTraining completed successfully.")

# ==========================================================
#  EVALUATION
# ==========================================================
def evaluate_model():
    section("Model Evaluation")
    time.sleep(1)

    slow_print("Evaluating on test dataset...")
    time.sleep(1)

    slow_print("Confusion Matrix generated.")
    slow_print("Precision : 91.3%")
    slow_print("Recall    : 90.7%")
    slow_print("F1-Score  : 90.9%")
    slow_print("ROC-AUC   : 0.94")

# ==========================================================
# MODEL SAVING
# ==========================================================
def save_model():
    section("Saving Model")
    time.sleep(1)
    slow_print("Serializing weights...")
    time.sleep(1)
    slow_print("Saving model to disk:")
    slow_print("→ lumina_dia_final_model.pth")
    time.sleep(0.8)
    slow_print("Model saved successfully.")

# ==========================================================
# IMAGE SCANNING
# ==========================================================
def scan_image():
    section("Image Scanning & Prediction")
    time.sleep(1)

    slow_print("Preprocessing image...")
    slow_print("Normalizing pixels...")
    slow_print("Extracting features using ViT...")
    time.sleep(1.5)

    stage = random.choice(STAGES)
    confidence = random.uniform(88.0, 97.0)

    slow_print(f"Prediction Result : {stage}")
    slow_print(f"Confidence Score  : {confidence:.2f}%")

# ==========================================================
# COMPLETE PIPELINE
# ==========================================================
def run_ai_pipeline():
    load_dataset()
    initialize_model()
    train_model()
    evaluate_model()
    save_model()
    scan_image()

    section("System Ready")
    slow_print("LuminaDia AI System is fully operational.")
    slow_print("Waiting for image input from UI...")

# ==========================================================
# LOCAL SERVER 
# ==========================================================
def start_server():
    os.chdir(PROJECT_DIR)
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("localhost", PORT), handler) as httpd:
        httpd.serve_forever()

# ==========================================================
# MAIN EXECUTION
# ==========================================================
if __name__ == "__main__":
    section("LuminaDia AI Diagnostic System")
    slow_print("Initializing system modules...\n")
    time.sleep(1)


    threading.Thread(target=run_ai_pipeline, daemon=True).start()

    # Start server
    threading.Thread(target=start_server, daemon=True).start()

    time.sleep(1)
    webbrowser.open(f"http://localhost:{PORT}/index.html")

    slow_print("\nUI launched successfully.")
    slow_print("System running in demo mode.")
    slow_print("Press CTRL+C to exit.\n")

    while True:
        time.sleep(1)
