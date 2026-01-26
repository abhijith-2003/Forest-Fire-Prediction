import joblib
import pandas as pd
import os

FEATURE_ORDER = ['temp', 'rh', 'ws', 'rain']

# Load model and scaler once when the module is imported
base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, '..', 'model', 'fire_model.pkl')
scaler_path = os.path.join(base_dir, '..', 'model', 'scaler.pkl')

model = joblib.load(model_path)
scaler = joblib.load(scaler_path)

def predict_fire(input_dict):
    """
    Predict fire risk. The model and scaler are pre-loaded for performance.
    """

    X = pd.DataFrame([input_dict], columns=FEATURE_ORDER)
    X_scaled = scaler.transform(X)
    pred = model.predict(X_scaled)[0]

    return "Fire" if pred == 1 else "No Fire"