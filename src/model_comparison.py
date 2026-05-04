"""
model_comparison.py
===================
ฟังก์ชัน evaluate โมเดลทั้งหมดจากไฟล์ .pkl จริง
ใช้สำหรับ /model-comparison API endpoint
"""

import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# ─── Paths ────────────────────────────────────────────────────────────────────
BASE_DIR  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "clean.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")

FEATURES = [
    "doctor_influence2",
    "friend_influence",
    "price_sensitive",
    "acne",
    "skin_type_encoded",
    "acne_friendly_score",
    "gender",
]
TARGET = "target_kiyora"

MODEL_FILES = [
    {"name": "Logistic Regression", "file": "logistic_regression.pkl", "selected": True},
    {"name": "SVM",                 "file": "svm.pkl",                 "selected": False},
    {"name": "Random Forest",       "file": "random_forest.pkl",       "selected": False},
    {"name": "Decision Tree",       "file": "decision_tree.pkl",       "selected": False},
    {"name": "KNN",                 "file": "knn.pkl",                 "selected": False},
]

def get_model_comparison():
    """
    โหลดโมเดลทุกตัวจาก .pkl และประเมินผลบน Test Set จริง
    Returns:
        dict: { "testSize": int, "models": list[dict] }
    """
    df = pd.read_csv(DATA_PATH)
    X  = df[FEATURES]
    y  = df[TARGET]

    _, X_test, _, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )

    results = []
    for entry in MODEL_FILES:
        pkl_path = os.path.join(MODEL_DIR, entry["file"])
        if not os.path.exists(pkl_path):
            # ไม่พบไฟล์ → ใส่ค่า 0 ทั้งหมด
            results.append({
                "name":      entry["name"],
                "accuracy":  0.0,
                "precision": 0.0,
                "recall":    0.0,
                "f1":        0.0,
                "selected":  entry["selected"],
            })
            continue

        model  = joblib.load(pkl_path)
        y_pred = model.predict(X_test)

        results.append({
            "name":      entry["name"],
            "accuracy":  round(accuracy_score(y_test, y_pred), 4),
            "precision": round(precision_score(y_test, y_pred, zero_division=0), 4),
            "recall":    round(recall_score(y_test, y_pred, zero_division=0), 4),
            "f1":        round(f1_score(y_test, y_pred, zero_division=0), 4),
            "selected":  entry["selected"],
        })

    return {
        "testSize": len(X_test),
        "models":   results,
    }
