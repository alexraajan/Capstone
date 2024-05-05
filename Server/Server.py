from flask import Flask, jsonify, request
import pandas as pd
from flask_cors import CORS
import Business_Layer
app = Flask(__name__)
CORS(app)


@app.route('/api/SchoolData', methods=['POST'])
def get_School_filtered_data():
    keyword = request.form['keyword']
    filtered_df = Business_Layer.getSchoolData(keyword)
    if filtered_df is not None:
        schools_dict_list = [school.__dict__ for school in filtered_df]
        return jsonify(schools_dict_list)
    else:
        jsonify({"error": "Failed to filter data"})

@app.route('/api/CrimeData', methods=['POST'])
def get_Crime_filtered_data():
    keyword = request.form['keyword']
    filtered_df = Business_Layer.getCrimeData(keyword)
    if filtered_df is not None:
        crime_dict_list = [crime.__dict__ for crime in filtered_df]
        return jsonify(crime_dict_list)
    else:
        jsonify({"error": "Failed to filter data"})

@app.route('/api/TotalCrimeData', methods=['POST'])
def get_AllCrime_filtered_data():
    filtered_df = Business_Layer.getTotalCrime()
    if filtered_df is not None:
        crime_dict_list = [crime.__dict__ for crime in filtered_df]
        return jsonify(crime_dict_list)
    else:
        jsonify({"error": "Failed to filter data"})

@app.route('/api/Suburb', methods=['GET'])
def get_Suburb_filtered_data():
    filtered_df = Business_Layer.getSuburb()
    if filtered_df is not None:
        suburb_dict_list = [suburb.__dict__ for suburb in filtered_df]
        return jsonify(suburb_dict_list)
    else:
        jsonify({"error": "Failed to filter data"})

@app.route('/api/Prediction', methods=['POST'])
def get_prediction_data():
    suburb = request.form['suburb']
    bedroomCount = request.form['bedroomCount']
    filtered_df = Business_Layer.getPrediction(suburb, bedroomCount)
    if filtered_df is not None:
        prediction_dict_list = [prediction.__dict__ for prediction in filtered_df]
        return jsonify(prediction_dict_list)
    else:
        jsonify({"error": "Failed to filter data"})

if __name__ == '__main__':
    app.run(debug=True)