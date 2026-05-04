"""
supervised_evaluate.py
======================
เปรียบเทียบประสิทธิภาพของโมเดล Supervised Learning ทั้งหมดสำหรับโปรเจกต์ Kiyora
ประเมินผลบน Test Set (20%) ด้วยตัวชี้วัด: Accuracy, Precision, Recall, F1-Score

วิธีใช้งาน:
  python src/supervised_evaluate.py

หมายเหตุ: ต้องรัน supervised_train.py ก่อนเพื่อสร้างไฟล์โมเดล (.pkl)
"""

import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, classification_report, confusion_matrix
)

# ─── Paths ────────────────────────────────────────────────────────────────────
BASE_DIR  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "clean.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")

# ─── Features & Target ────────────────────────────────────────────────────────
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

# ─── Load Data ────────────────────────────────────────────────────────────────
df = pd.read_csv(DATA_PATH)
X  = df[FEATURES]
y  = df[TARGET]

_, X_test, _, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# ─── Model Files ──────────────────────────────────────────────────────────────
MODEL_FILES = {
    "Logistic Regression ★": "logistic_regression.pkl",
    "SVM":                    "svm.pkl",
    "Random Forest":          "random_forest.pkl",
    "Decision Tree":          "decision_tree.pkl",
    "KNN":                    "knn.pkl",
}

# ─── Evaluate All Models ──────────────────────────────────────────────────────
print("\n" + "═" * 72)
print("   Kiyora Brand Analysis — Supervised Learning Model Comparison")
print("═" * 72)
print(f"   Test Set: {len(X_test)} samples  |  Target: '{TARGET}'")
print(f"   Class distribution (test): {y_test.value_counts().to_dict()}")
print("═" * 72)

header = f"  {'Model':<28} {'Accuracy':>10} {'Precision':>10} {'Recall':>10} {'F1-Score':>10}"
print(header)
print("  " + "─" * 70)

results = []

for name, pkl_file in MODEL_FILES.items():
    pkl_path = os.path.join(MODEL_DIR, pkl_file)
    if not os.path.exists(pkl_path):
        print(f"  ⚠️  {name:<28} — ไม่พบไฟล์ {pkl_file}  (รัน supervised_train.py ก่อน)")
        continue

    model  = joblib.load(pkl_path)
    y_pred = model.predict(X_test)

    acc  = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec  = recall_score(y_test, y_pred, zero_division=0)
    f1   = f1_score(y_test, y_pred, zero_division=0)

    results.append({"Model": name, "Accuracy": acc, "Precision": prec, "Recall": rec, "F1": f1})
    print(f"  {name:<28} {acc:>9.2%} {prec:>10.2%} {rec:>10.2%} {f1:>10.2%}")

print("  " + "─" * 70)
print()

# ─── Best Model by Recall (Class 1) ──────────────────────────────────────────
if results:
    best = max(results, key=lambda x: (x["Recall"], x["F1"]))
    print(f"  🏆 Best Model (by Recall + F1): {best['Model']}")
    print(f"     Recall = {best['Recall']:.2%}  |  F1 = {best['F1']:.2%}")
    print()

# ─── Detailed Report: Logistic Regression ─────────────────────────────────────
lr_path = os.path.join(MODEL_DIR, "logistic_regression.pkl")
if os.path.exists(lr_path):
    lr_model   = joblib.load(lr_path)
    y_pred_lr  = lr_model.predict(X_test)

    print("─" * 72)
    print("  Classification Report — Logistic Regression (Selected Model)")
    print("─" * 72)
    print(classification_report(y_test, y_pred_lr, target_names=["Non-Kiyora (0)", "Kiyora User (1)"]))

    print("  Confusion Matrix:")
    cm = confusion_matrix(y_test, y_pred_lr)
    print(f"                 Predicted 0   Predicted 1")
    print(f"  Actual 0       {cm[0][0]:>8}      {cm[0][1]:>8}")
    print(f"  Actual 1       {cm[1][0]:>8}      {cm[1][1]:>8}")
    print()

print("═" * 72)
print("  ✅ Evaluation complete")
print("═" * 72 + "\n")
