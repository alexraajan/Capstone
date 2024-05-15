import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# Load your data
data = pd.read_csv('dataset.csv')

# Ensure only numeric columns are included
columns_to_exclude = ['Median House Price', 'Highest ICSEA Value', 'Year', 'Postcode']
numeric_features = data.select_dtypes(include=[np.number]).columns.drop(columns_to_exclude)
X = data[numeric_features]  
y = data['Median House Price']  

# Scaling features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Random Forest model
random_forest = RandomForestRegressor(n_estimators=100, random_state=42)
random_forest.fit(X_train, y_train)
y_pred = random_forest.predict(X_test)
mse = mean_squared_error(y_test, y_pred)

# Extract feature importances
feature_importances = random_forest.feature_importances_
features_df = pd.DataFrame({
    'Feature': numeric_features,
    'Importance': feature_importances
}).sort_values(by='Importance', ascending=False)

# Convert importances to percentages
features_df['Importance'] = features_df['Importance'] * 100

# Plotting the feature importances with percentages
plt.figure(figsize=(12, 8))
bars = plt.barh(features_df['Feature'], features_df['Importance'], color='steelblue')
plt.xlabel('Importance (%)')
plt.ylabel('Feature')
plt.title('Feature Importances for Predicting Median House Prices')

# Add text labels 
for bar in bars:
    plt.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height()/2,
             '{:.2f}%'.format(bar.get_width()), va='center')

plt.gca().invert_yaxis()  
plt.show()
