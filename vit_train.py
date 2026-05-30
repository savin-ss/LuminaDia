import os
import torch
from torch import nn, optim
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image
from transformers import ViTForImageClassification

# Paths
DATA_DIR = "data"
MODEL_SAVE_PATH = "models/detector.pth"
BATCH_SIZE = 16
EPOCHS = 5
LR = 2e-5
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Dataset
class AlignedFaceDataset(Dataset):
    def __init__(self, root_dir, transform=None):
        self.samples = []
        self.transform = transform

        class_names = sorted(os.listdir(root_dir))
        self.class_to_idx = {cls: i for i, cls in enumerate(class_names)}

        for cls in class_names:
            aligned_dir = os.path.join(root_dir, cls, "aligned")
            if not os.path.isdir(aligned_dir):
                continue

            for img in os.listdir(aligned_dir):
                if img.lower().endswith((".jpg", ".png", ".jpeg")):
                    self.samples.append((os.path.join(aligned_dir, img),
                                         self.class_to_idx[cls]))

        self.classes = class_names

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        path, label = self.samples[idx]
        image = Image.open(path).convert("RGB")
        if self.transform:
            image = self.transform(image)
        return image, label

# Transforms
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

dataset = AlignedFaceDataset(DATA_DIR, transform=transform)
print(f"Total samples: {len(dataset)}")

loader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True)

num_classes = len(dataset.classes)
print("Classes:", dataset.classes)

model = ViTForImageClassification.from_pretrained(
    "google/vit-base-patch16-224",
    num_labels=num_classes
)

model.to(DEVICE)

criterion = nn.CrossEntropyLoss()
optimizer = optim.AdamW(model.parameters(), lr=LR)

# Training
for epoch in range(EPOCHS):
    model.train()
    total_loss = 0

    for images, labels in loader:
        images, labels = images.to(DEVICE), labels.to(DEVICE)

        optimizer.zero_grad()
        outputs = model(images).logits
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    print(f"Epoch {epoch+1}/{EPOCHS} — Loss: {total_loss/len(loader):.4f}")

# Save model
os.makedirs("models", exist_ok=True)
torch.save(model.state_dict(), MODEL_SAVE_PATH)
print("Model saved to:", MODEL_SAVE_PATH)
