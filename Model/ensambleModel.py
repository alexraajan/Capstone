import pickle
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split, KFold, RandomizedSearchCV
from sklearn.ensemble import RandomForestRegressor, VotingRegressor
from sklearn.pipeline import Pipeline
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_percentage_error, r2_score, mean_squared_error, mean_absolute_error
from category_encoders import TargetEncoder
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler

# Load data
data_path = 'dataset-final.csv'
data = pd.read_csv(data_path)

# Define features and target variable
X = data.drop(['Median House Price'], axis=1)
y = data['Median House Price']

# Split the dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Numerical data preprocessing
numerical_features = X.select_dtypes(include=['int64', 'float64']).columns
numerical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

# Categorical data preprocessing
categorical_features = X.select_dtypes(include=['object']).columns
categorical_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('target_encoder', TargetEncoder())
])

# Combine preprocessing steps
preprocessor = ColumnTransformer(
    transformers=[
        ('num', numerical_transformer, numerical_features),
        ('cat', categorical_transformer, categorical_features)
    ]
)

# Base models
rf_model = RandomForestRegressor(random_state=42)
xgb_model = XGBRegressor(random_state=42)

# Voting regressor
model = VotingRegressor([('rf', rf_model), ('xgb', xgb_model)])

# Create a pipeline
pipeline = Pipeline(steps=[('preprocessor', preprocessor),
                           ('model', model)])

# Hyperparameter grid for tuning
param_grid = {
    'model__rf__n_estimators': [100, 200, 300],
    'model__rf__max_depth': [None, 10, 20, 30],
    'model__xgb__n_estimators': [100, 200, 300],
    'model__xgb__max_depth': [3, 6, 9]
}

# RandomizedSearchCV for hyperparameter tuning
cv = KFold(n_splits=5, shuffle=True, random_state=42)
random_search = RandomizedSearchCV(estimator=pipeline,
                                   param_distributions=param_grid,
                                   n_iter=10,
                                   cv=cv,
                                   scoring='neg_mean_squared_error',
                                   verbose=1,
                                   random_state=42)

# Train model with cross-validation
random_search.fit(X_train, y_train)

# Save model
pickle_file_path = 'house_price_prediction_model.pkl'
with open(pickle_file_path, 'wb') as file:
    pickle.dump(random_search.best_estimator_, file)

print(f"Optimized model saved to {pickle_file_path}")

# Predicting
y_pred = random_search.predict(X_test)

# Evaluation metrics
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
mape = mean_absolute_percentage_error(y_test, y_pred)

# Evaluation results
print("Root Mean Squared Error:", rmse)
print("R^2 Score:", r2)
print("Mean Absolute Error:", mae)
print("Mean Absolute Percentage Error:", mape)

# Plot actual vs. predicted prices
plt.figure(figsize=(10, 6))
plt.scatter(y_test, y_pred, alpha=0.5)
plt.title('Actual vs. Predicted Median House Prices - Ensemble Model')
plt.xlabel('Actual Median House Price')
plt.ylabel('Predicted Median House Price')
plt.plot([y.min(), y.max()], [y.min(), y.max()], 'k--', lw=2)
plt.grid(True)
plt.show()
