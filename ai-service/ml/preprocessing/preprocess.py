import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler


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


# Separate features and target
X = df.drop("Outcome", axis=1)
y = df["Outcome"]


# Replace invalid zeros with NaN
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


# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# Create median imputer
imputer = SimpleImputer(strategy="median")


# Learn medians ONLY from training data
X_train_imputed = imputer.fit_transform(X_train)


# Apply the same medians to test data
X_test_imputed = imputer.transform(X_test)
# Feature scaling
scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train_imputed)
X_test_scaled = scaler.transform(X_test_imputed)

print("\nAfter scaling:")
print("Training shape:", X_train_scaled.shape)
print("Testing shape:", X_test_scaled.shape)

print("\nFirst training sample before scaling:")
print(X_train_imputed[0])

print("\nFirst training sample after scaling:")
print(X_train_scaled[0])


print("Original training shape:", X_train.shape)
print("Original testing shape:", X_test.shape)

print("\nAfter imputation:")
print("Training shape:", X_train_imputed.shape)
print("Testing shape:", X_test_imputed.shape)

print("\nMedian values learned from training data:")

for feature, median in zip(X.columns, imputer.statistics_):
    print(f"{feature}: {median}")