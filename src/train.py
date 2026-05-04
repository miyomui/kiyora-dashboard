import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

df = pd.read_csv("data/clean.csv")

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

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

model = LogisticRegression(class_weight="balanced", max_iter=1000)
model.fit(X_train, y_train)

# save model
joblib.dump(model, "models/model.pkl")

print("Model saved!")