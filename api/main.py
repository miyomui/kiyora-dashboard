import sys
import os

# --- เพิ่ม 2 บรรทัดนี้ เพื่อให้ Python มองเห็นโฟลเดอร์ src ที่อยู่ข้างนอก ---
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from src.predict import predict

app = FastAPI()

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
    return {"message": "Kiyora Model API is running 🚀"}

@app.post("/predict")
def predict_api(data: InputData):
    result = predict(data.dict())
    return result