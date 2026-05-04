import requests

url = "http://127.0.0.1:8001/predict"
data = {
    "doctor_influence2": 1,
    "friend_influence": 1,
    "price_sensitive": 0,
    "acne": 1,
    "skin_type_encoded": 1,
    "acne_friendly_score": 0.8,
    "gender": 0
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
