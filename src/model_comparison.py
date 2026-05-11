"""
model_comparison.py
===================
ฟังก์ชัน evaluate โมเดลทั้งหมดจากไฟล์ .pkl จริง
ใช้สำหรับ /model-comparison API endpoint
"""

import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

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
FEATURE_LABELS = {
    "doctor_influence2": "คำแนะนำแพทย์",
    "friend_influence": "คำแนะนำเพื่อน",
    "price_sensitive": "ความอ่อนไหวต่อราคา",
    "acne": "ปัญหาสิว/ผิวหน้า",
    "skin_type_encoded": "ประเภทผิว",
    "acne_friendly_score": "สูตรอ่อนโยน",
    "gender": "เพศ",
}
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
    โหลดโมเดลทุกตัวจาก .pkl และประเมินผลบนทั้ง Train และ Test Set
    รวมถึงสกัด Feature Importance และ Confusion Matrix ของโมเดลหลัก
    """
    df = pd.read_csv(DATA_PATH)
    X  = df[FEATURES]
    y  = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )

    results = []
    main_insights = {
        "featureImportance": [],
        "confusionMatrix": []
    }

    for entry in MODEL_FILES:
        pkl_path = os.path.join(MODEL_DIR, entry["file"])
        if not os.path.exists(pkl_path):
            results.append({
                "name": entry["name"],
                "train": {"accuracy": 0, "precision": 0, "recall": 0, "f1": 0},
                "test":  {"accuracy": 0, "precision": 0, "recall": 0, "f1": 0},
                "selected": entry["selected"],
            })
            continue

        model = joblib.load(pkl_path)
        
        # Train metrics
        y_train_pred = model.predict(X_train)
        train_metrics = {
            "accuracy":  round(accuracy_score(y_train, y_train_pred), 4),
            "precision": round(precision_score(y_train, y_train_pred, zero_division=0), 4),
            "recall":    round(recall_score(y_train, y_train_pred, zero_division=0), 4),
            "f1":        round(f1_score(y_train, y_train_pred, zero_division=0), 4),
        }

        # Test metrics
        y_test_pred = model.predict(X_test)
        test_metrics = {
            "accuracy":  round(accuracy_score(y_test, y_test_pred), 4),
            "precision": round(precision_score(y_test, y_test_pred, zero_division=0), 4),
            "recall":    round(recall_score(y_test, y_test_pred, zero_division=0), 4),
            "f1":        round(f1_score(y_test, y_test_pred, zero_division=0), 4),
        }

        # Extract Insights for the Selected Model (Logistic Regression)
        if entry["selected"] and entry["name"] == "Logistic Regression":
            # Feature Importance from coefficients
            if hasattr(model, "coef_"):
                coefs = model.coef_[0]
                importance = []
                for feat, val in zip(FEATURES, coefs):
                    importance.append({
                        "feature": FEATURE_LABELS.get(feat, feat),
                        "score": round(float(val), 4)
                    })
                # Sort by absolute score descending
                importance.sort(key=lambda x: abs(x["score"]), reverse=True)
                main_insights["featureImportance"] = importance

            # Confusion Matrix on Test Set
            cm = confusion_matrix(y_test, y_test_pred)
            # Flatten to: [ [TN, FP], [FN, TP] ]
            main_insights["confusionMatrix"] = cm.tolist()

        results.append({
            "name": entry["name"],
            "train": train_metrics,
            "test": test_metrics,
            "selected": entry["selected"],
        })

    return {
        "trainSize": len(X_train),
        "testSize": len(X_test),
        "models": results,
        "insights": main_insights
    }

