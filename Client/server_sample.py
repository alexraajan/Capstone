from flask import Flask, jsonify, request
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# Function to read CSV file and filter DataFrame
def filter_data(csv_file_path, keyword):
    try:
        # Read the CSV file into a DataFrame
        df = pd.read_csv(csv_file_path)

        # Filter rows where 'Town_suburb' column includes the keyword
        filtered_df = df[df['Town_suburb'].str.contains(keyword, case=False, na=False)]

        return filtered_df
    except Exception as e:
        print("Error processing data:", e)
        return None
def filter_address(csv_file_path,keyword):
    try:
        # Read the CSV file into a DataFrame
        df = pd.read_csv(csv_file_path)

        # Filter rows where 'Town_suburb' column includes the keyword
        #filtered_df = df[df['Town_suburb'].str.contains(keyword, case=False, na=False)]
        unique_addresses = df.drop_duplicates(subset=['House No.', 'Street', 'Suburb', 'Postcode'])
        #suburb_filter = 'SampleSuburb'
        #filtered_addresses = unique_addresses[unique_addresses[keyword]]
        #filtered_df = df[df['Suburb'].str.contains(keyword, case=False, na=False)]
        filtered_df = unique_addresses[unique_addresses['Suburb'].str.contains(keyword, case=False, na=False)]

        return filtered_df
    except Exception as e:
        print("Error processing data:", e)
        return None

def getsuburb(csv_file_path):
    try:
        # Read the CSV file into a DataFrame
        df = pd.read_csv(csv_file_path)

        unique_suburbs = df['Suburb'].unique()

        # Convert the unique values to a DataFrame
        unique_suburbs_df = pd.DataFrame(unique_suburbs, columns=['Suburb'])

        return unique_suburbs_df
    except Exception as e:
        print("Error processing data:", e)
        return None

def filter_crime_data(csv_file_path, suburb_name):
    try:
        # Read the CSV file into a DataFrame
        df = pd.read_csv(csv_file_path)

        # Filter rows for the specified suburb
        filtered_df = df[df['Suburb'].str.contains(suburb_name, case=False, na=False)]

        # Group by 'Offence category' and sum the counts across all relevant columns
        total_counts = filtered_df.groupby('Offence category').sum()

        # Reset index to make 'Offence category' a column again, not the index
        total_counts_reset = total_counts.reset_index()

        # If you only want the first and last columns from the summed result,
        # adjust here to select those columns. Assuming those columns represent
        # the 'Offence category' and a sum of counts:
        result_df = total_counts_reset.iloc[:, [0, -1]]

        # Convert the DataFrame to a list of dictionaries for JSON response
        result_list = result_df.to_dict(orient='records')
        return result_list
    except Exception as e:
            print("Error processing data:", e)
            return None

def total_crime_data(csv_file_path):
    try:
        # Read the CSV file into a DataFrame
        df = pd.read_csv(csv_file_path)

        # Filter rows for the specified suburb
        #filtered_df = df[df['Suburb'].str.contains(suburb_name, case=False, na=False)]

        # Group by 'Offence category' and sum the counts across all relevant columns
        total_counts = df.groupby('Offence category').sum()

        # Reset index to make 'Offence category' a column again, not the index
        total_counts_reset = total_counts.reset_index()

        # If you only want the first and last columns from the summed result,
        # adjust here to select those columns. Assuming those columns represent
        # the 'Offence category' and a sum of counts:
        result_df = total_counts_reset.iloc[:, [0, -1]]

        # Convert the DataFrame to a list of dictionaries for JSON response
        result_list = result_df.to_dict(orient='records')
        return result_list
    except Exception as e:
            print("Error processing data:", e)
            return None


# Define an API endpoint that returns the filtered DataFrame as JSON
@app.route('/api/filter', methods=['POST'])
def get_filtered_data():
    keyword = request.form['keyword']
    csv_file_path = r'C:\Users\Home\Desktop\Capstone\master_dataset_school.csv'
    filtered_df = filter_data(csv_file_path, keyword)

    if filtered_df is not None:
        return jsonify(filtered_df.to_dict(orient='records'))
    else:
        return jsonify({"error": "Failed to filter data"})

@app.route('/api/getSuburb', methods=['GET'])
def get_suburb_data():
    csv_file_path = r'C:\Users\Home\Desktop\Capstone\Address.csv'
    filtered_df = getsuburb(csv_file_path)

    if filtered_df is not None:
        return jsonify(filtered_df.to_dict(orient='records'))
    else:
        return jsonify({"error": "Failed to filter data"})

@app.route('/api/filterCrime', methods=['POST'])
def get_filtered_crime_data():
    try:
        print("inside function")
        csv_file_path = r'C:\Users\Home\Desktop\Capstone\SuburbData2022_Crime.csv'  # Adjust the path as needed
        suburb_name = request.form['suburb']  # Assuming the suburb is passed in the request form data
        result_list = filter_crime_data(csv_file_path, suburb_name)

        if result_list is not None:
            return jsonify(result_list)
        else:
            return jsonify({"error": "Failed to filter crime data"})
    except Exception as e:
        print(f"Error in get_filtered_crime_data: {e}")
        return jsonify({"error": "Server error"}), 500

@app.route('/api/totalCrime', methods=['POST'])
def get_total_crime_data():
    try:
        print("inside function")
        csv_file_path = r'C:\Users\Home\Desktop\Capstone\SuburbData2022_Crime.csv'  # Adjust the path as needed
        #suburb_name = request.form['suburb']  # Assuming the suburb is passed in the request form data
        result_list = total_crime_data(csv_file_path)

        if result_list is not None:
            return jsonify(result_list)
        else:
            return jsonify({"error": "Failed to filter crime data"})
    except Exception as e:
        print(f"Error in get_filtered_crime_data: {e}")
        return jsonify({"error": "Server error"}), 500

@app.route('/api/address', methods=['POST'])
def get_address_data():
    keyword = request.form['keyword']
    csv_file_path = r'..\DataSet\Address.csv'
    filtered_df = filter_address(csv_file_path,keyword)

    if filtered_df is not None:
        filtered_df.fillna("", inplace=True)
        return jsonify(filtered_df.to_dict(orient='records'))
    else:
        return jsonify({"error": "Failed to filter data"})


# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)