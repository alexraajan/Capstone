import pandas as pd
import pickle
import os
def predictValue(suburb,bedRoomCount, ICSEA_Value, CrimeValue):
    model_path = os.path.join(os.path.dirname(__file__), '..', 'Model', 'house_price_prediction_model.pkl')
    with open(model_path, 'rb') as file:
        model = pickle.load(file)

    data = {
        'Year': [2025, 2026, 2027, 2028, 2029],
        'Suburb': [suburb]*5,
        'Bedroom Count': [bedRoomCount]*5,
        'Highest ICSEA Value': [ICSEA_Value]*5,
        'Crime Count': [CrimeValue]*5,
        'Year-ended Inflation': ["4.1", "3.8", "3.2", "2.8", "3"]
    }
    df = pd.DataFrame(data)
    # Use the model to predict house prices
    predictions = model.predict(df)
    # Print the predictions
    return predictions
