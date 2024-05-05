import pyodbc
import Entity

def connection():
    # Connection string using Windows Authentication
    conn_str = 'DRIVER={ODBC Driver 17 for SQL Server};Server=DESKTOP-66TAT9D\SQLEXPRESS;Database=RealEstate;Trusted_Connection=yes;'

    # Connect to the database
    conn = pyodbc.connect(conn_str)
    return conn

def fetchSchoolData(suburb):
    # Do some database operations
    conn = connection()
    cursor = conn.cursor()
    cursor.execute("select School_name,Level_of_schooling,Street,Postcode,Phone,School_Email  from [dbo].[master_dataset_school] where Town_suburb ='"+suburb+"'")  # Adjust the SQL query as needed
    rows = cursor.fetchall()
    # Clean up
    cursor.close()
    conn.close()
    return rows

def fetchcrimeData(suburb):
    conn = connection()
    cursor = conn.cursor()
    cursor.execute(
        "select Subcategory,Total_count from [dbo].[SuburbCategoryTotals] where suburb ='" + suburb + "'")  # Adjust the SQL query as needed
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

r1 = getCrimeValue('Fairy Meadow')
print(r1[0][0])

r2 = getICSEA_Value('Fairy Meadow')
print(r2[0][0])