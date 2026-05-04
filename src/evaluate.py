import pandas as pd
import joblib
from sklearn.metrics import classification_report

df = pd.read_csv("data/clean.csv")

model = joblib.load("models/model.pkl")

features = [
    "doctor_influence2",
    "friend_influence",
    "price_sensitive",
    "acne",
    "skin_type_encoded",
    "acne_friendly_score",
    "gender"
]

X = df[features]
y = df["target_kiyora"]

y_pred = model.predict(X)

print(classification_report(y, y_pred))