import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression


columns = [
    "Pregnancies",
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI",
    "DiabetesPedigreeFunction",
    "Age",
    "Outcome"
]

df = pd.read_csv(
    "ml/data/diabetes.csv",
    header=None,
    names=columns
)

X = df.drop("Outcome", axis=1)
y = df["Outcome"]

invalid_zero_columns = [
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI"
]

X[invalid_zero_columns] = X[
    invalid_zero_columns
].replace(0, float("nan"))

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

imputer = SimpleImputer(strategy="median")
X_train_imputed = imputer.fit_transform(X_train)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train_imputed)

model = LogisticRegression(
    max_iter=1000,
    random_state=42
)

model.fit(X_train_scaled, y_train)

joblib.dump(model, "ml/models/diabetes_model.pkl")
joblib.dump(imputer, "ml/models/diabetes_imputer.pkl")
joblib.dump(scaler, "ml/models/diabetes_scaler.pkl")

print("\nDiabetes model saved successfully.")
print("Model: ml/models/diabetes_model.pkl")
print("Imputer: ml/models/diabetes_imputer.pkl")
print("Scaler: ml/models/diabetes_scaler.pkl")