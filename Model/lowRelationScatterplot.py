import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

# Load your data
data = pd.read_csv('dataset.csv')

# Ensure only numeric columns are included
columns_to_exclude = ['Median House Price', 'Highest ICSEA Value', 'Year', 'Postcode']
sns.set(style="whitegrid")

# Create a scatter plot for Homicide incidents
plt.figure(figsize=(10, 6))
sns.scatterplot(data=data, x='Year', y='Homicide ', color='blue', alpha=0.5)
plt.axhline(y=1, color='red', linestyle='--', label='Low Occurrence Threshold')
plt.title('Homicide Incidents Over Time')
plt.xlabel('Year')
plt.ylabel('Number of Homicide Incidents')
plt.legend()
plt.show()

# Create a scatter plot for Abduction and kidnapping incidents
plt.figure(figsize=(10, 6))
sns.scatterplot(data=data, x='Year', y='Abduction and kidnapping', color='orange', alpha=0.5)
plt.axhline(y=1, color='red', linestyle='--', label='Low Occurrence Threshold')
plt.title('Abduction and Kidnapping Incidents Over Time')
plt.xlabel('Year')
plt.ylabel('Number of Abduction and Kidnapping Incidents')
plt.legend()
plt.show()
