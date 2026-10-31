import pandas as pd

from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

from xgboost import XGBClassifier


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
# Separate Features and Target
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
# Cross Validation
# -----------------------------

cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)


# -----------------------------
# Models
# -----------------------------

logistic_regression = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
    (
        "model",
        LogisticRegression(
            max_iter=1000,
            random_state=42
        )
    )
])


random_forest = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    (
        "model",
        RandomForestClassifier(
            n_estimators=200,
            random_state=42
        )
    )
])


xgboost = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    (
        "model",
        XGBClassifier(
            n_estimators=200,
            max_depth=4,
            learning_rate=0.05,
            random_state=42,
            eval_metric="logloss"
        )
    )
])


models = {
    "Logistic Regression": logistic_regression,
    "Random Forest": random_forest,
    "XGBoost": xgboost
}


# -----------------------------
# Evaluation
# -----------------------------

scoring = {
    "accuracy": "accuracy",
    "precision": "precision",
    "recall": "recall",
    "f1": "f1",
    "roc_auc": "roc_auc"
}


for name, model in models.items():

    results = cross_validate(
        model,
        X,
        y,
        cv=cv,
        scoring=scoring
    )

    print("\n" + "=" * 50)
    print(name)
    print("=" * 50)

    print(
        "Accuracy :",
        results["test_accuracy"].mean()
    )

    print(
        "Precision:",
        results["test_precision"].mean()
    )

    print(
        "Recall   :",
        results["test_recall"].mean()
    )

    print(
        "F1 Score :",
        results["test_f1"].mean()
    )

    print(
        "ROC-AUC  :",
        results["test_roc_auc"].mean()
    )