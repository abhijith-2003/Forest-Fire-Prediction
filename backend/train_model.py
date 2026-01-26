import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
import joblib
import os

# Get directory of the current script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, '..', 'data', 'forest_fires.csv')
MODEL_DIR = os.path.join(BASE_DIR, 'model')

# Ensure model directory exists
if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)

# 1. Load data
df = pd.read_csv(DATA_PATH)

# 2. Clean data
df.columns = df.columns.str.strip().str.lower()
df = df.dropna() # Remove any empty rows or missing values
df['classes'] = df['classes'].str.lower().map({'fire': 1, 'not fire': 0})
df = df.dropna(subset=['classes']) # Ensure target is not NaN

# 3. Select only 4 features
FEATURES = ['temp', 'rh', 'ws', 'rain']
X = df[FEATURES]
y = df['classes']

# 4. Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 5. Scale
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 6. Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

# 7. Evaluate
pred = model.predict(X_test_scaled)
print("Accuracy:", accuracy_score(y_test, pred))

# 8. Save model and scaler
joblib.dump(model, os.path.join(MODEL_DIR, 'fire_model.pkl'))
joblib.dump(scaler, os.path.join(MODEL_DIR, 'scaler.pkl'))
print(f"Model & scaler saved to {MODEL_DIR}!")