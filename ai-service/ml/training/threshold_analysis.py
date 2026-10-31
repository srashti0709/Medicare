import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

from sklearn.metrics import (
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)


# -----------------------------
# Load Dataset
# -----------------------------

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


# -----------------------------
# Features and Target
# -----------------------------

X = df.drop("Outcome", axis=1)
y = df["Outcome"]


# -----------------------------
# Replace Invalid Zeros
# -----------------------------

columns_with_invalid_zero = [
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI"
]

X[columns_with_invalid_zero] = X[
    columns_with_invalid_zero
].replace(
    0,
    float("nan")
)


# -----------------------------
# Train / Validation Split
# -----------------------------

X_train, X_validation, y_train, y_validation = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# -----------------------------
# Imputation
# -----------------------------

imputer = SimpleImputer(
    strategy="median"
)

X_train_imputed = imputer.fit_transform(
    X_train
)

X_validation_imputed = imputer.transform(
    X_validation
)


# -----------------------------
# Scaling
# -----------------------------

scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(
    X_train_imputed
)

X_validation_scaled = scaler.transform(
    X_validation_imputed
)


# -----------------------------
# Train Model
# -----------------------------

model = LogisticRegression(
    max_iter=1000,
    random_state=42
)

model.fit(
    X_train_scaled,
    y_train
)


# -----------------------------
# Get Probabilities
# -----------------------------

probabilities = model.predict_proba(
    X_validation_scaled
)[:, 1]


# -----------------------------
# Test Different Thresholds
# -----------------------------

thresholds = [
    0.30,
    0.35,
    0.40,
    0.45,
    0.50,
    0.55,
    0.60,
    0.65,
    0.70
]


print("\nThreshold Analysis")
print("------------------")

for threshold in thresholds:

    predictions = (
        probabilities >= threshold
    ).astype(int)

    precision = precision_score(
        y_validation,
        predictions,
        zero_division=0
    )

    recall = recall_score(
        y_validation,
        predictions,
        zero_division=0
    )

    f1 = f1_score(
        y_validation,
        predictions,
        zero_division=0
    )

    tn, fp, fn, tp = confusion_matrix(
        y_validation,
        predictions
    ).ravel()

    print(
        f"\nThreshold: {threshold}"
    )

    print(
        f"Precision: {precision:.3f}"
    )

    print(
        f"Recall:    {recall:.3f}"
    )

    print(
        f"F1 Score:  {f1:.3f}"
    )

    print(
        f"TN: {tn}, FP: {fp}, FN: {fn}, TP: {tp}"
    )