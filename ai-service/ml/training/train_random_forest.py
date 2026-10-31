import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
    roc_auc_score
)

# -----------------------------------
# 1. Load dataset
# -----------------------------------

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

# -----------------------------------
# 2. Features and target
# -----------------------------------

X = df.drop("Outcome", axis=1)
y = df["Outcome"]

# -----------------------------------
# 3. Replace invalid zeros
# -----------------------------------

columns_with_invalid_zero = [
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI"
]

X[columns_with_invalid_zero] = X[columns_with_invalid_zero].replace(
    0,
    float("nan")
)

# -----------------------------------
# 4. Train/Test split
# -----------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

# -----------------------------------
# 5. Median imputation
# -----------------------------------

imputer = SimpleImputer(strategy="median")

X_train_imputed = imputer.fit_transform(X_train)
X_test_imputed = imputer.transform(X_test)

# -----------------------------------
# 6. Random Forest
# -----------------------------------

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

model.fit(X_train_imputed, y_train)

# -----------------------------------
# 7. Predictions
# -----------------------------------

y_pred = model.predict(X_test_imputed)

y_prob = model.predict_proba(X_test_imputed)[:, 1]

# -----------------------------------
# 8. Evaluation
# -----------------------------------

accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)
roc_auc = roc_auc_score(y_test, y_prob)

print("\nRandom Forest Evaluation")
print("------------------------")

print("Accuracy :", accuracy)
print("Precision:", precision)
print("Recall   :", recall)
print("F1 Score :", f1)
print("ROC-AUC  :", roc_auc)

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# -----------------------------------
# 9. Save model and imputer
# -----------------------------------

joblib.dump(
    model,
    "ml/models/random_forest.pkl"
)

joblib.dump(
    imputer,
    "ml/models/imputer.pkl"
)

print("\nModel saved successfully!")
print("Model: ml/models/random_forest.pkl")
print("Imputer: ml/models/imputer.pkl")