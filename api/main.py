import sys
import os

# Allow Python to find src/ modules from project root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from src.predict import predict
from src.model_comparison import get_model_comparison

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
    return predict(data.dict())

@app.get("/model-comparison")
def model_comparison_api():
    """
    ประเมินผลโมเดลทุกตัวจาก .pkl จริง และส่งตัวเลขกลับไปให้ Frontend
    """
    return get_model_comparison()