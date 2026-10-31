import joblib
import pandas as pd


MODEL_FILE = "ml/models/kidney_model.pkl"

model = joblib.load(MODEL_FILE)


def predict_kidney_disease(patient_data):

    columns = [
        "age",
        "bp",
        "sg",
        "al",
        "su",
        "rbc",
        "pc",
        "pcc",
        "ba",
        "bgr",
        "bu",
        "sc",
        "sod",
        "pot",
        "hemo",
        "pcv",
        "wbcc",
        "rbcc",
        "htn",
        "dm",
        "cad",
        "appet",
        "pe",
        "ane"
    ]

    df = pd.DataFrame(
        [patient_data],
        columns=columns
    )

    prediction = model.predict(df)[0]
    probability = model.predict_proba(df)[0][1]

    return {
        "prediction": int(prediction),
        "probability": round(float(probability), 4)
    }