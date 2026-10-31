import pandas as pd
import shap

from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression


# Load dataset
file_path = "ml/data/diabetes.csv"

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
    file_path,
    header=None,
    names=columns
)


# Features and target
X = df.drop("Outcome", axis=1)
y = df["Outcome"]


# Replace invalid zeros
columns_with_invalid_zero = [
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI"
]

X[columns_with_invalid_zero] = X[
    columns_with_invalid_zero
].replace(0, float("nan"))


# Train / test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# Imputation
imputer = SimpleImputer(strategy="median")

X_train_imputed = imputer.fit_transform(X_train)
X_test_imputed = imputer.transform(X_test)


# Scaling
scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train_imputed)
X_test_scaled = scaler.transform(X_test_imputed)


# Train Logistic Regression
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


# Feature importance
print("\nSHAP Feature Importance")
print("-----------------------")

importance = pd.DataFrame({
    "Feature": columns[:-1],
    "Importance": abs(shap_values.values).mean(axis=0)
})

importance = importance.sort_values(
    by="Importance",
    ascending=False
)

print(importance)


# Plot
import matplotlib.pyplot as plt

shap.summary_plot(
    shap_values,
    X_test_scaled,
    feature_names=columns[:-1],
    show=False
)

plt.tight_layout()
plt.savefig("ml/training/shap_summary.png", dpi=300)
plt.close()

print("\nSHAP plot saved successfully.")