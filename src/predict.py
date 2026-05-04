import joblib
import pandas as pd
import os

# Load model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "model.pkl")
model = joblib.load(MODEL_PATH)

def predict(data_dict):
    """
    Predicts the kiyora target based on input data.
    
    Args:
        data_dict (dict): Dictionary containing the 7 required features.
        
    Returns:
        dict: Prediction result and probability.
    """
    # Define feature order to match training
    features = [
        "doctor_influence2",
        "friend_influence",
        "price_sensitive",
        "acne",
        "skin_type_encoded",
        "acne_friendly_score",
        "gender"
    ]
    
    # Create DataFrame for prediction
    df_input = pd.DataFrame([data_dict])[features]
    
    # Make prediction
    prediction = int(model.predict(df_input)[0])
    probability = model.predict_proba(df_input)[0].tolist()
    
    return {
        "prediction": prediction,
        "prediction_label": "Kiyora User" if prediction == 1 else "Non-Kiyora User",
        "probability": {
            "0 (Other)": round(probability[0], 4),
            "1 (Kiyora)": round(probability[1], 4)
        }
    }

if __name__ == "__main__":
    # Test case
    data = {
    "doctor_influence2": 1,
    "friend_influence": 1,
    "price_sensitive": 0,
    "acne": 1,
    "skin_type_encoded": 1,
    "acne_friendly_score": 0.8,
    "gender": 0
}
    print(predict(data))