import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.pipeline import Pipeline
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_percentage_error, r2_score, mean_squared_error, mean_absolute_error
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer

# Load the dataset
data_path = 'dataset-final.csv'
data = pd.read_csv(data_path)

# features and target
X = data.drop(['Median House Price'], axis=1)
y = data['Median House Price']

# Splitting data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Preprocessing
numerical_features = X.select_dtypes(include=['int64', 'float64']).columns
categorical_features = X.select_dtypes(include=['object']).columns

numerical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('onehot', OneHotEncoder(handle_unknown='ignore'))
])

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numerical_transformer, numerical_features),
        ('cat', categorical_transformer, categorical_features)
    ])

# XGBoost model and pipeline
model = XGBRegressor(random_state=42)
pipeline = Pipeline(steps=[('preprocessor', preprocessor),
                           ('model', model)])

# Grid Search
param_grid = {
    'model__n_estimators': [100, 200, 500],  
    'model__learning_rate': [0.01, 0.1, 0.2],  
    'model__max_depth': [3, 6, 9],  
    'model__min_child_weight': [1, 3, 5]  
}

grid_search = GridSearchCV(pipeline, param_grid, cv=3, scoring='r2', verbose=1)
grid_search.fit(X_train, y_train)
best_model = grid_search.best_estimator_

y_pred = best_model.predict(X_test)

# Evaluation metric:
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
mape = mean_absolute_percentage_error(y_test, y_pred)

# Print error metrics
print("Root Mean Squared Error:", rmse)
print("R^2 Score:", r2)
print("Mean Absolute Error:", mae)
print("Mean Absolute Percentage Error:", mape)

# Optional: Plot for visual comparison
plt.figure(figsize=(10, 6))
plt.scatter(y_test, y_pred, alpha=0.5)
plt.title('Actual vs. Predicted Median House Prices - XGBoost')
plt.xlabel('Actual Median House Price')
plt.ylabel('Predicted Median House Price')
plt.plot([y.min(), y.max()], [y.min(), y.max()], 'k--', lw=2)
plt.grid(True)
plt.show()
