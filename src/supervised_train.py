"""
supervised_train.py
===================
ฝึกสอนโมเดล Supervised Learning หลายรูปแบบสำหรับโปรเจกต์ Kiyora Brand Analysis
โจทย์: Binary Classification — ทำนายว่าลูกค้าจะเลือกใช้แบรนด์ Kiyora หรือไม่

โมเดลที่ฝึกสอน:
  1. Logistic Regression  (โมเดลหลักที่เลือกใช้จริง)
  2. Support Vector Machine (SVM)
  3. Random Forest
  4. Decision Tree
  5. K-Nearest Neighbors (KNN)

Output:
  - models/logistic_regression.pkl  ← โมเดลหลัก (ใช้กับ API)
  - models/svm.pkl
  - models/random_forest.pkl
  - models/decision_tree.pkl
  - models/knn.pkl
  - models/model.pkl               ← alias ของโมเดลหลัก (backward-compatible)
"""

import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier

# ─── Paths ────────────────────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH  = os.path.join(BASE_DIR, "data", "clean.csv")
MODEL_DIR  = os.path.join(BASE_DIR, "models")
os.makedirs(MODEL_DIR, exist_ok=True)

# ─── Features & Target ────────────────────────────────────────────────────────
FEATURES = [
    "doctor_influence2",   # อิทธิพลจากแพทย์
    "friend_influence",    # อิทธิพลจากเพื่อน
    "price_sensitive",     # ความอ่อนไหวต่อราคา
    "acne",                # ปัญหาเรื่องสิว
    "skin_type_encoded",   # ประเภทผิว (encoded)
    "acne_friendly_score", # คะแนนสูตรอ่อนโยน
    "gender",              # เพศ
]
TARGET = "target_kiyora"

# ─── Load Data ────────────────────────────────────────────────────────────────
print("📂 Loading data...")
df = pd.read_csv(DATA_PATH)
X  = df[FEATURES]
y  = df[TARGET]

print(f"   Dataset: {len(df)} samples  |  Class distribution: {y.value_counts().to_dict()}")

# ─── Train / Test Split ───────────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)
print(f"   Train: {len(X_train)} samples  |  Test: {len(X_test)} samples\n")

# ─── Model Definitions ────────────────────────────────────────────────────────
# หมายเหตุ: ใช้ class_weight="balanced" สำหรับโมเดลที่รองรับ
# เพื่อจัดการกับข้อมูลที่ไม่สมดุล (Class 0 >> Class 1)
MODELS = {
    "logistic_regression": LogisticRegression(
        class_weight="balanced", max_iter=1000, random_state=42
    ),
    "svm": SVC(
        probability=True, class_weight="balanced",
        kernel="rbf", C=1.0, random_state=42
    ),
    "random_forest": RandomForestClassifier(
        n_estimators=100, class_weight="balanced",
        max_depth=5, random_state=42
    ),
    "decision_tree": DecisionTreeClassifier(
        class_weight="balanced", max_depth=5, random_state=42
    ),
    "knn": KNeighborsClassifier(
        n_neighbors=5, metric="euclidean"
    ),
}

# ─── Train & Save All Models ──────────────────────────────────────────────────
print("🤖 Training models...")
for name, model in MODELS.items():
    model.fit(X_train, y_train)
    save_path = os.path.join(MODEL_DIR, f"{name}.pkl")
    joblib.dump(model, save_path)
    print(f"   ✓ {name:<22} → saved to models/{name}.pkl")

# Save Logistic Regression as default model (for API compatibility)
default_model_path = os.path.join(MODEL_DIR, "model.pkl")
joblib.dump(MODELS["logistic_regression"], default_model_path)
print(f"\n   ✓ models/model.pkl  → alias of Logistic Regression (used by API)")

print("\n✅ All models trained and saved successfully!")
print("   → Run `python src/supervised_evaluate.py` to compare model performance")
