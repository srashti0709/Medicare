import pandas as pd


INPUT_FILE = "ml/data/kidney_disease/kidney_disease.csv"
OUTPUT_FILE = "ml/data/kidney_disease/kidney_disease_clean.csv"


df = pd.read_csv(INPUT_FILE)

# Remove spaces from column names
df.columns = df.columns.str.strip()

# Remove spaces from string values
for column in df.select_dtypes(include="object").columns:
    df[column] = df[column].str.strip()

# Replace missing values
df = df.replace("?", pd.NA)

# Convert numeric columns
numeric_columns = [
    "age",
    "bp",
    "sg",
    "al",
    "su",
    "bgr",
    "bu",
    "sc",
    "sod",
    "pot",
    "hemo",
    "pcv",
    "wbcc",
    "rbcc"
]

for column in numeric_columns:
    df[column] = pd.to_numeric(df[column], errors="coerce")

# Normalize target
df["class"] = df["class"].str.lower()

df["class"] = df["class"].replace({
    "no": "notckd"
})

# Remove rows without target
df = df.dropna(subset=["class"])

df.to_csv(OUTPUT_FILE, index=False)

print("Kidney dataset cleaned successfully.")
print("Shape:", df.shape)
print("\nMissing values:")
print(df.isna().sum())
print("\nTarget distribution:")
print(df["class"].value_counts())