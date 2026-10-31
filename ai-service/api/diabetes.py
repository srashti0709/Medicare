from fastapi import APIRouter
from pydantic import BaseModel

from ml.predict import predict_diabetes


router = APIRouter(
    prefix="/api/diabetes",
    tags=["Diabetes Prediction"]
)


class DiabetesInput(BaseModel):
    Pregnancies: int
    Glucose: float
    BloodPressure: float
    SkinThickness: float
    Insulin: float
    BMI: float
    DiabetesPedigreeFunction: float
    Age: int


@router.post("/predict")
def diabetes_prediction(data: DiabetesInput):

    patient_data = [
        data.Pregnancies,
        data.Glucose,
        data.BloodPressure,
        data.SkinThickness,
        data.Insulin,
        data.BMI,
        data.DiabetesPedigreeFunction,
        data.Age
    ]

    return predict_diabetes(patient_data)