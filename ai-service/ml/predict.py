import joblib
import pandas as pd

from ml.training.threshold_config import THRESHOLD


model = joblib.load("ml/models/diabetes_model.pkl")
imputer = joblib.load("ml/models/diabetes_imputer.pkl")
scaler = joblib.load("ml/models/diabetes_scaler.pkl")


def predict_diabetes(patient_data):

    columns = [
        "Pregnancies",
        "Glucose",
        "BloodPressure",
        "SkinThickness",
        "Insulin",
        "BMI",
        "DiabetesPedigreeFunction",
        "Age"
    ]

    df = pd.DataFrame(
        [patient_data],
        columns=columns
    )

    invalid_zero_columns = [
        "Glucose",
        "BloodPressure",
        "SkinThickness",
        "Insulin",
        "BMI"
    ]

    df[invalid_zero_columns] = df[
        invalid_zero_columns
    ].replace(0, float("nan"))

    df_imputed = imputer.transform(df)

    df_scaled = scaler.transform(df_imputed)

    probability = model.predict_proba(df_scaled)[0][1]

    prediction = int(probability >= THRESHOLD)

    return {
        "prediction": prediction,
        "probability": round(float(probability), 4),
        "threshold": THRESHOLD
    }