from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from .model import predict_fire

app = FastAPI()

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FireInput(BaseModel):
    temp: float = Field(..., ge=-20, le=60, description="Temperature in Celsius")
    rh: float = Field(..., ge=0, le=100, description="Relative Humidity percentage")
    ws: float = Field(..., ge=0, le=150, description="Wind Speed in km/h")
    rain: float = Field(..., ge=0, le=500, description="Rainfall in mm")

@app.post("/predict")
def predict(data: FireInput):
    input_dict = data.dict()
    result = predict_fire(input_dict)
    return {"prediction": result}