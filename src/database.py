import sqlite3
import os
from datetime import datetime

# Path relative to the project root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "data", "kiyora_logs.db")

def init_db():
    """สร้างฐานข้อมูลและตารางถ้ายังไม่มี"""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # ตารางบันทึกการทำนาย
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            doctor_influence2 INTEGER,
            friend_influence INTEGER,
            price_sensitive INTEGER,
            acne INTEGER,
            skin_type_encoded INTEGER,
            acne_friendly_score REAL,
            gender INTEGER,
            prediction INTEGER,
            prediction_label TEXT,
            prob_kiyora REAL,
            timestamp DATETIME
        )
    """)
    conn.commit()
    conn.close()

def log_prediction(input_data: dict, result: dict):
    """บันทึกข้อมูลการทำนายลงใน SQLite"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO predictions (
            doctor_influence2, friend_influence, price_sensitive, 
            acne, skin_type_encoded, acne_friendly_score, gender,
            prediction, prediction_label, prob_kiyora, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        input_data.get("doctor_influence2"),
        input_data.get("friend_influence"),
        input_data.get("price_sensitive"),
        input_data.get("acne"),
        input_data.get("skin_type_encoded"),
        input_data.get("acne_friendly_score"),
        input_data.get("gender"),
        result.get("prediction"),
        result.get("prediction_label"),
        result.get("probability", {}).get("1 (Kiyora)"),
        datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ))
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    print(f"Initializing database at: {DB_PATH}")
    init_db()
    print("Database initialized successfully.")
