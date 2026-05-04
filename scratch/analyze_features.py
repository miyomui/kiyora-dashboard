import pandas as pd

# Load data
df = pd.read_csv("data/clean.csv")

# Select only numeric columns for correlation
numeric_df = df.select_dtypes(include=['number'])

# Calculate correlation with target_kiyora
correlations = numeric_df.corr()['target_kiyora'].sort_values(ascending=False)

with open("scratch/correlation_results.txt", "w", encoding="utf-8") as f:
    f.write("Top 20 Correlations with target_kiyora:\n")
    f.write(str(correlations.head(20)))
    f.write("\n\nBottom 20 Correlations with target_kiyora:\n")
    f.write(str(correlations.tail(20)))

print("✅ Analysis saved to scratch/correlation_results.txt")

# Also look at descriptive stats for potential features
print("\nDescriptive Stats for potential features:")
print(df.describe())
