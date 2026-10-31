import csv


input_file = "ml/data/kidney_disease/chronic_kidney_disease.arff"
output_file = "ml/data/kidney_disease/kidney_disease.csv"


attributes = []
data_started = False
rows = []


with open(input_file, "r", encoding="utf-8") as file:

    for line in file:
        line = line.strip()

        if not line:
            continue

        if line.lower() == "@data":
            data_started = True
            continue

        if not data_started:
            if line.lower().startswith("@attribute"):
                parts = line.split()

                attribute_name = parts[1].strip("'\"")
                attributes.append(attribute_name)

        else:
            values = [value.strip() for value in line.split(",")]

            if len(values) == len(attributes):
                rows.append(values)
            elif len(values) > len(attributes):
                rows.append(values[:len(attributes)])


with open(output_file, "w", newline="", encoding="utf-8") as file:

    writer = csv.writer(file)

    writer.writerow(attributes)
    writer.writerows(rows)


print("Conversion completed successfully.")
print(f"Rows: {len(rows)}")
print(f"Columns: {len(attributes)}")