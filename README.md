# Forest Fire Prediction System

The **Forest Fire Prediction System** is an advanced full-stack intelligence platform designed to mitigate environmental disasters through predictive modeling. By leveraging climate data from the Algerian Forest Fire dataset, the system utilizes a high-precision **Random Forest Classifier** to analyze complex correlations between meteorological variables and fire outbreaks. 

This project integrates a robust **FastAPI** backend for immediate inference with a cutting-edge **React** frontend, providing an immersive, glassmorphic user experience. The architecture emphasizes data integrity by preventing model leakage through careful feature selection, ensuring that predictions are based on true environmental triggers. Designed for both scalability and professional aesthetics, this system serves as a bridge between environmental science and modern application development.

## 🚀 Setup Instructions

### 1. Backend (FastAPI)
```bash
# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows
source venv/bin/activate     # Linux/Mac

# Install dependencies
pip install -r backend/requirements.txt

# Run training (Optional: to regenerate models)
python backend/train_model.py

# Start the API server
uvicorn backend.api.main:app --reload
```

### 2. Frontend (React + Tailwind)
```bash
cd frontend
npm install
npm run dev
```

## 🔄 Project Workflow
The system operates in three distinct layers to provide real-time forest fire risk assessment:

1.  **Data & Training Layer:** Weather data from the Algerian Forest Fire dataset is cleaned and used to train a **Random Forest Classifier**. This model learns patterns between features like temperature/humidity and the occurrence of fire. The trained model and data scaler are saved as `.pkl` files.
2.  **API Layer (FastAPI backend):** A high-performance web server loads the pre-trained model into memory. It provides a `/predict` endpoint that accepts weather inputs, scales them using the saved parameters, and returns a "Fire" or "No Fire" result.
3.  **UI Layer (React frontend):** A modern, responsive dashboard allows users to input current weather conditions. It features real-time validation to ensure data entry matches scientific ranges. When submitted, it communicates with the API and displays the result with immersive visual feedback.

## 🧠 Machine Learning Design

### Input Features
The model uses 4 key meteorological features:
- `temp`: Temperature in Celsius
- `rh`: Relative Humidity (%)
- `ws`: Wind Speed (km/h)
- `rain`: Rainfall (mm)

### Project Structure
- `backend/`: FastAPI logic & pickled models.
- `frontend/`: React dashboard with Tailwind V4.
- `data/`: Algerian Forest Fire dataset logs.
