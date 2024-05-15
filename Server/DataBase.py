import pyodbc
import os
import json
def get_db_connection_string():
    try:
        #file_path = os.path.join(os.path.dirname(__file__), '..', '..', 'env_parameters', 'env_parameters.json')
        file_path = os.path.join(os.path.dirname(__file__), 'env_parameters', 'env_parameters.json')
        #file_path = r"C:\Users\alexr\OneDrive\Desktop\Cap_project\Server\env_parameters\env_parameters.json"
        print(file_path)
        # Open and read the JSON file
        with open(file_path, 'r') as file:
            config_data = json.load(file)

        # Read the 'environment' key to determine which environment to use
        environment = config_data['environment']

        # Fetch the database connection string for the specified environment
        connection_string = config_data[environment]['DbConnectionString']
        return connection_string
    except KeyError:
        return "Environment key not found or incorrect environment specified."
    except FileNotFoundError:
        return "The JSON file was not found."
    except Exception as e:
        return f"An error occurred: {str(e)}"


def connection():
    # Connection string using Windows Authentication
    conn_str = get_db_connection_string()

    # Connect to the database
    conn = pyodbc.connect(conn_str)
    return conn

def fetchcrimeData(suburb):
    conn = connection()
    cursor = conn.cursor()
    cursor.execute(
        "select Subcategory,Total_count from [dbo].[SuburbCategoryTotals] where suburb ='" + suburb + "' order by 2 desc")  # Adjust the SQL query as needed
    rows = cursor.fetchall()
    # Clean up
    cursor.close()
    conn.close()
    return rows
def fetchSchoolData(suburb):
    # Do some database operations
    conn = connection()
    cursor = conn.cursor()
    cursor.execute("select School_name,Level_of_schooling,Street,Postcode,Website,School_Email, ICSEA_value, Latitude, Longitude, School_subtype, LBOTE_pct,Indigenous_pct, latest_year_enrolment_FTE  from [dbo].[master_dataset_school] where Town_suburb ='"+suburb+"'")  # Adjust the SQL query as needed
    rows = cursor.fetchall()
    # Clean up
    cursor.close()
    conn.close()
    return rows



def fetchSuburbData(suburb):
    conn = connection()
    cursor = conn.cursor()
    cursor.execute(
        "select Subcategory,Total_count from [dbo].[SuburbCategoryTotals] where suburb ='" + suburb + "'")  # Adjust the SQL query as needed
    rows = cursor.fetchall()
    # Clean up
    cursor.close()
    conn.close()
    return rows

def getAllCrimeData():
    conn = connection()
    cursor = conn.cursor()
    cursor.execute(
        "select Subcategory, sum(Total_count) from [dbo].[SuburbCategoryTotals] group by Subcategory")  # Adjust the SQL query as needed
    rows = cursor.fetchall()
    # Clean up
    cursor.close()
    conn.close()
    return rows

def getSuburb():
    conn = connection()
    cursor = conn.cursor()
    cursor.execute(
        "select Town_suburb from [dbo].[Suburb] where IsActive = 1")  # Adjust the SQL query as needed
    rows = cursor.fetchall()
    # Clean up
    cursor.close()
    conn.close()
    return rows

def getICSEA_Value(suburb):
    conn = connection()
    cursor = conn.cursor()
    cursor.execute(
        "select distinct Highest_ICSEA_Value from [ModelDataSet] where Suburb = '" + suburb + "'")  # Adjust the SQL query as needed
    rows = cursor.fetchall()
    # Clean up
    cursor.close()
    conn.close()
    return rows


def getCrimeValue(suburb):
    conn = connection()
    cursor = conn.cursor()
    cursor.execute(
        "select avg(Crime_Count) from [ModelDataSet] where Suburb = '" + suburb + "'")  # Adjust the SQL query as needed
    rows = cursor.fetchall()
    # Clean up
    cursor.close()
    conn.close()
    return rows

def getTotalCrimeNumber():
    conn = connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT SUM(Total_count) AS TotalSum FROM [dbo].[SuburbCategoryTotals]")  # Adjust the SQL query as needed
    rows = cursor.fetchall()
    # Clean up
    cursor.close()
    conn.close()
    return rows

def getSuburbTotalCrimeNumber(suburb):
    conn = connection()
    cursor = conn.cursor()
    cursor.execute(
        "select sum(Total_count) from [dbo].[SuburbCategoryTotals] where suburb ='" + suburb + "'")  # Adjust the SQL query as needed
    rows = cursor.fetchall()
    # Clean up
    cursor.close()
    conn.close()
    return rows
