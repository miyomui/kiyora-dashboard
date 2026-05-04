"""
predict.py
==========
ฟังก์ชันทำนายผลสำหรับ API ของโปรเจกต์ Kiyora Brand Analysis
ใช้โมเดลหลัก: Logistic Regression (บันทึกที่ models/logistic_regression.pkl)

วิธีใช้งาน:
  จาก API: from src.predict import predict
  ทดสอบ:   python src/predict.py
"""

import os
import joblib
import pandas as pd

# ─── Load Model ───────────────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "logistic_regression.pkl")

# Fallback to model.pkl for backward compatibility
if not os.path.exists(MODEL_PATH):
    MODEL_PATH = os.path.join(BASE_DIR, "models", "model.pkl")

model = joblib.load(MODEL_PATH)

# ─── Feature Order (must match training) ──────────────────────────────────────
FEATURES = [
    "doctor_influence2",   # อิทธิพลจากแพทย์
    "friend_influence",    # อิทธิพลจากเพื่อน
    "price_sensitive",     # ความอ่อนไหวต่อราคา
    "acne",                # ปัญหาเรื่องสิว
    "skin_type_encoded",   # ประเภทผิว (encoded)
    "acne_friendly_score", # คะแนนสูตรอ่อนโยน
    "gender",              # เพศ
]

# ─── Predict Function ─────────────────────────────────────────────────────────
def predict(data_dict: dict) -> dict:
    """
    ทำนายผลว่าลูกค้าจะเลือกใช้แบรนด์ Kiyora หรือไม่

    Args:
        data_dict (dict): Dictionary ที่มี 7 features ตามรายการ FEATURES

    Returns:
        dict: {
            "prediction": int (0 หรือ 1),
            "prediction_label": str,
            "probability": {"0 (Other)": float, "1 (Kiyora)": float}
        }
    """
    df_input = pd.DataFrame([data_dict])[FEATURES]

    prediction  = int(model.predict(df_input)[0])
    probability = model.predict_proba(df_input)[0].tolist()

    return {
        "prediction": prediction,
        "prediction_label": "Kiyora User" if prediction == 1 else "Non-Kiyora User",
        "probability": {
            "0 (Other)":   round(probability[0], 4),
            "1 (Kiyora)":  round(probability[1], 4),
        },
    }

# ─── Quick Test ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    test_cases = [
        {
            "label": "ลูกค้าที่มีแนวโน้มสูง (อิทธิพลแพทย์สูง, มีปัญหาสิว)",
            "data": {
                "doctor_influence2": 1, "friend_influence": 1,
                "price_sensitive": 0,  "acne": 1,
                "skin_type_encoded": 1, "acne_friendly_score": 0.8,
                "gender": 0,
            },
        },
        {
            "label": "ลูกค้าที่มีแนวโน้มต่ำ (ไม่อิทธิพลจากแพทย์, ราคาสำคัญ)",
            "data": {
                "doctor_influence2": 0, "friend_influence": 0,
                "price_sensitive": 1,  "acne": 0,
                "skin_type_encoded": 0, "acne_friendly_score": 0.2,
                "gender": 1,
            },
        },
    ]

    print("\n" + "═" * 55)
    print("  Kiyora Prediction — Quick Test")
    print("═" * 55)
    for case in test_cases:
        result = predict(case["data"])
        prob   = result["probability"]["1 (Kiyora)"]
        label  = result["prediction_label"]
        print(f"\n  📋 {case['label']}")
        print(f"     → {label}  (ความน่าจะเป็น Kiyora: {prob:.1%})")
    print("\n" + "═" * 55 + "\n")