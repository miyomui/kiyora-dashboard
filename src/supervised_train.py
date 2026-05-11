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

# ─── Imports ──────────────────────────────────────────────────────────────────
from imblearn.over_sampling import SMOTE
from sklearn.model_selection import GridSearchCV

# ─── Train / Test Split ───────────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)
print(f"   Train: {len(X_train)} samples  |  Test: {len(X_test)} samples\n")

# ─── Data Balancing (SMOTE) ───────────────────────────────────────────────────
print("⚖️ Balancing data with SMOTE...")
smote = SMOTE(random_state=42, k_neighbors=3) # ใช้ k_neighbors น้อยเพราะข้อมูลมีน้อย
X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)
print(f"   Original train class distribution: {y_train.value_counts().to_dict()}")
print(f"   Resampled train class distribution: {y_train_resampled.value_counts().to_dict()}\n")

# ─── Model Definitions & Hyperparameter Grids ─────────────────────────────────
# กำหนด Grid สำหรับค้นหาพารามิเตอร์ที่ดีที่สุด (Hyperparameter Tuning)
MODELS_GRID = {
    "logistic_regression": {
        "model": LogisticRegression(class_weight="balanced", max_iter=2000, random_state=42),
        "params": {
            "C": [0.01, 0.1, 1.0, 10.0],
            "solver": ["liblinear", "lbfgs"]
        }
    },
    "svm": {
        "model": SVC(probability=True, class_weight="balanced", random_state=42),
        "params": {
            "C": [0.1, 1.0, 10.0],
            "kernel": ["linear", "rbf"]
        }
    },
    "random_forest": {
        "model": RandomForestClassifier(class_weight="balanced", random_state=42),
        "params": {
            "n_estimators": [50, 100, 200],
            "max_depth": [3, 5, None]
        }
    },
    "decision_tree": {
        "model": DecisionTreeClassifier(class_weight="balanced", random_state=42),
        "params": {
            "max_depth": [3, 5, 7, None],
            "min_samples_split": [2, 5, 10]
        }
    },
    "knn": {
        "model": KNeighborsClassifier(metric="euclidean"),
        "params": {
            "n_neighbors": [3, 5, 7],
            "weights": ["uniform", "distance"]
        }
    },
}

# ─── Train, Tune & Save All Models ────────────────────────────────────────────
print("🤖 Training and Tuning models (GridSearchCV)...")
best_models = {}

for name, config in MODELS_GRID.items():
    print(f"   ➤ Tuning {name}...")
    # ใช้ GridSearchCV เพื่อหาพารามิเตอร์ที่ดีที่สุด โดยแบ่ง k-fold = 3 (เพราะข้อมูลน้อย)
    grid_search = GridSearchCV(
        estimator=config["model"],
        param_grid=config["params"],
        cv=3,
        scoring="f1_macro", # เน้นค่า F1 เพื่อแก้ปัญหา Imbalance
        n_jobs=-1
    )
    # Train ด้วยข้อมูลที่ถูก Balance แล้ว
    grid_search.fit(X_train_resampled, y_train_resampled)
    
    best_model = grid_search.best_estimator_
    best_models[name] = best_model
    
    print(f"      Best Params: {grid_search.best_params_}")
    
    save_path = os.path.join(MODEL_DIR, f"{name}.pkl")
    joblib.dump(best_model, save_path)
    print(f"      ✓ Saved to models/{name}.pkl\n")

# Save Logistic Regression as default model (for API compatibility)
default_model_path = os.path.join(MODEL_DIR, "model.pkl")
joblib.dump(best_models["logistic_regression"], default_model_path)
print(f"   ✓ models/model.pkl  → alias of best Logistic Regression (used by API)")

print("\n✅ All models trained, tuned, and saved successfully!")
print("   → Run `python src/supervised_evaluate.py` to compare model performance")
