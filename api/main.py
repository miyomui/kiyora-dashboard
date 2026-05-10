import sys
import os

# Allow Python to find src/ modules from project root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from src.predict import predict
from src.model_comparison import get_model_comparison

from src.unsupervised_analysis import run_unsupervised_analysis
from src.database import init_db, log_prediction

# Initialize DB on startup
init_db()

app = FastAPI(title="Kiyora Brand Analysis API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InputData(BaseModel):
    doctor_influence2: int
    friend_influence: int
    price_sensitive: int
    acne: int
    skin_type_encoded: int
    acne_friendly_score: float
    gender: int

@app.get("/")
def home():
    return {"message": "Kiyora Model API is running"}

@app.post("/predict")
def predict_api(data: InputData):
    input_dict = data.dict()
    result = predict(input_dict)
    
    # Log to SQLite
    try:
        log_prediction(input_dict, result)
    except Exception as e:
        print(f"Database logging error: {e}")
        
    return result

@app.get("/model-comparison")
def model_comparison_api():
    """
    ประเมินผลโมเดลทุกตัวจาก .pkl จริง และส่งตัวเลขกลับไปให้ Frontend
    """
    return get_model_comparison()

@app.get("/unsupervised")
def unsupervised_api():
    """
    ดึงผลลัพธ์จาก Unsupervised Learning (Clustering, PCA, Anomalies)
    """
    return run_unsupervised_analysis()


@app.get("/insights")
def insights_api():
    """
    Demographic Profile + Business Dashboard (ข้อมูลจริงจาก clean.csv)
    """
    import pandas as pd
    import os

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    csv_path = os.path.join(base_dir, "data", "clean.csv")

    if not os.path.exists(csv_path):
        return {"error": "clean.csv not found"}

    df = pd.read_csv(csv_path)

    # ── 1. Demographic Profile ─────────────────────────────────────────
    gender_map = {0: "หญิง", 1: "ชาย"}
    gender_dist = (
        df["gender"]
        .map(gender_map)
        .value_counts()
        .to_dict()
    )

    age_dist = df["age"].value_counts().to_dict() if "age" in df.columns else {}

    income_dist = (
        df["monthly_income"].value_counts().to_dict()
        if "monthly_income" in df.columns
        else {}
    )

    skin_map = {
        "oily": "ผิวมัน",
        "dry": "ผิวแห้ง",
        "combination": "ผิวผสม",
        "normal": "ผิวธรรมดา",
        "unknown": "ไม่แน่ใจ",
    }
    skin_dist = (
        df["skin_type_clean"]
        .map(skin_map)
        .fillna(df["skin_type_clean"])
        .value_counts()
        .to_dict()
        if "skin_type_clean" in df.columns
        else {}
    )

    province_dist = (
        df["province"].value_counts().head(8).to_dict()
        if "province" in df.columns
        else {}
    )

    occupation_dist = (
        df["occupation"].value_counts().to_dict()
        if "occupation" in df.columns
        else {}
    )

    # ── 2. Brand Market Share ──────────────────────────────────────────
    brand_dist = (
        df["main_brand"].value_counts().head(10).to_dict()
        if "main_brand" in df.columns
        else {}
    )

    # ── 3. Skin Concerns Overview ──────────────────────────────────────
    concern_cols = ["acne", "oily", "sensitive", "pore", "dull", "dry"]
    concern_labels = {
        "acne": "สิว",
        "oily": "ผิวมัน",
        "sensitive": "ผิวแพ้ง่าย",
        "pore": "รูขุมขน",
        "dull": "ผิวหมองคล้ำ",
        "dry": "ผิวแห้ง",
    }
    skin_concerns = {}
    for c in concern_cols:
        if c in df.columns:
            skin_concerns[concern_labels.get(c, c)] = int(df[c].sum())

    # ── 4. Cleansing Type Usage ────────────────────────────────────────
    cleansing_cols = {
        "use_water": "Cleansing Water",
        "use_oil": "Cleansing Oil",
        "use_balm": "Cleansing Balm",
        "use_sheet": "Cleansing Sheet",
        "use_milk": "Cleansing Milk",
    }
    cleansing_usage = {}
    for col, label in cleansing_cols.items():
        if col in df.columns:
            cleansing_usage[label] = int(df[col].sum())

    # ── 5. Feature Importance (avg Likert scores) ──────────────────────
    likert_map = {
        "deep_cleansing_score": "Deep Cleansing",
        "acne_friendly_score": "Acne Friendly",
        "sensitive_skin_score": "Sensitive Skin",
        "no_irritant_score": "No Irritant",
        "hypoallergenic_score": "Hypoallergenic",
        "moisturizing_score": "Moisturizing",
        "low_friction_score": "Low Friction",
        "nourishment_score": "Nourishment",
        "eye_friendly_score": "Eye Friendly",
        "oil_control_score": "Oil Control",
    }
    feature_importance = {}
    for col, label in likert_map.items():
        if col in df.columns:
            feature_importance[label] = round(float(df[col].mean()), 3)

    # ── 6. Summary Stats ──────────────────────────────────────────────
    total = len(df)
    kiyora_users = int(df["target_kiyora"].sum()) if "target_kiyora" in df.columns else 0

    return {
        "total_respondents": total,
        "kiyora_users": kiyora_users,
        "demographic": {
            "gender": gender_dist,
            "age": age_dist,
            "income": income_dist,
            "skin_type": skin_dist,
            "province": province_dist,
            "occupation": occupation_dist,
        },
        "brand_market_share": brand_dist,
        "skin_concerns": skin_concerns,
        "cleansing_usage": cleansing_usage,
        "feature_importance": feature_importance,
    }