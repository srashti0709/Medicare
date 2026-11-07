from ml.kidney_predict import predict_kidney_disease

patient_data = [
    48, 80, 1.020, 1, 0,
    "normal", "normal", "notpresent", "notpresent",
    121, 36, 1.2, 140, 4.5, 15.4, 44, 7800, 5.2,
    "yes", "yes", "no", "good", "no", "no"
]

result = predict_kidney_disease(patient_data)

print("Prediction:", result["prediction"])
print("CKD Probability:", result["probability"])