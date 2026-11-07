
import joblib
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.metrics import classification_report, accuracy_score


INPUT_FILE = "ml/data/kidney_disease/kidney_disease_clean.csv"
MODEL_FILE = "ml/models/kidney_model.pkl"


df = pd.read_csv(INPUT_FILE)

# Remove rows with missing target labels
df = df.dropna(subset=["class"]).copy()

# Normalize target labels
df["class"] = df["class"].astype(str).str.strip().str.lower()

# Map target labels
y = df["class"].map({
    "notckd": 0,
    "ckd": 1
})

# Check for unexpected target labels
if y.isna().any():
    raise ValueError(
        f"Unexpected class labels: {df.loc[y.isna(), 'class'].unique()}"
    )

X = df.drop(columns=["class"])

# Dataset diagnostics
print("\n--- Kidney Dataset Diagnostics ---")
print("Total records:", len(df))

print("\nClass distribution:")
print(y.value_counts().rename(index={
    0: "Not CKD",
    1: "CKD"
}))

print("\nDuplicate records:", df.duplicated().sum())
print("Duplicate feature records:", X.duplicated().sum())


categorical_columns = X.select_dtypes(include="object").columns.tolist()
numeric_columns = X.select_dtypes(exclude="object").columns.tolist()


numeric_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])


categorical_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(handle_unknown="ignore"))
])


preprocessor = ColumnTransformer([
    ("numeric", numeric_pipeline, numeric_columns),
    ("categorical", categorical_pipeline, categorical_columns)
])


model = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", LogisticRegression(max_iter=1000))
])


X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


model.fit(X_train, y_train)


predictions = model.predict(X_test)


print("\nKidney Disease Model")
print("--------------------")
print("Accuracy:", round(accuracy_score(y_test, predictions), 4))
print()

print(classification_report(
    y_test,
    predictions,
    target_names=["Not CKD", "CKD"]
))


joblib.dump(model, MODEL_FILE)

print("Model saved successfully.")
print(MODEL_FILE)
