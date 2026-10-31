import pandas as pd
import shap

from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression


# Load dataset
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

# Replace invalid zeros
invalid_zero_columns = [
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI"
]

X[invalid_zero_columns] = X[invalid_zero_columns].replace(
    0, float("nan")
)

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

# Impute
imputer = SimpleImputer(strategy="median")

X_train_imputed = imputer.fit_transform(X_train)
X_test_imputed = imputer.transform(X_test)

# Scale
scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train_imputed)
X_test_scaled = scaler.transform(X_test_imputed)

# Train model
model = LogisticRegression(
    max_iter=1000,
    random_state=42
)

model.fit(X_train_scaled, y_train)

# SHAP
explainer = shap.Explainer(
    model,
    X_train_scaled,
    feature_names=columns[:-1]
)

shap_values = explainer(X_test_scaled)

# Explain first test patient
patient_index = 0

print("\nIndividual Patient Explanation")
print("------------------------------")

print("Actual outcome:", y_test.iloc[patient_index])

probability = model.predict_proba(
    X_test_scaled[patient_index].reshape(1, -1)
)[0][1]

print(f"Predicted diabetes probability: {probability:.2%}")

print("\nFeature contributions:")

patient_shap = shap_values[patient_index]

for feature, value in zip(
    columns[:-1],
    patient_shap.values
):
    print(f"{feature}: {value:.4f}")
import matplotlib.pyplot as plt

shap.plots.waterfall(
    patient_shap,
    show=False
)

plt.tight_layout()
plt.savefig(
    "ml/training/shap_patient_explanation.png",
    dpi=300,
    bbox_inches="tight"
)
plt.close()

print("\nPatient SHAP plot saved successfully.")