import DataBase
import Entity
import pickel
def getSchoolData(keyword):
    rows = DataBase.fetchSchoolData(keyword)
    school_objects = []
    for row in rows:
           school_obj = Entity.School(row[0], row[1], row[2], row[3], row[4], row[5])
           school_objects.append(school_obj)
    return school_objects

def getCrimeData(keyword):
    rows = DataBase.fetchcrimeData(keyword)
    crime_objects = []
    for row in rows:
           crime_obj = Entity.Crime(row[0], row[1])
           crime_objects.append(crime_obj)
    return crime_objects

def getTotalCrime():
    rows = DataBase.getAllCrimeData()
    crime_objects = []
    for row in rows:
        crime_obj = Entity.Crime(row[0], row[1])
        crime_objects.append(crime_obj)
    return crime_objects

def getSuburb():
    rows = DataBase.getSuburb()
    suburb_objects = []
    for row in rows:
        suburb_obj = Entity.Suburb(row[0])
        suburb_objects.append(suburb_obj)
    return suburb_objects

def getPrediction(suburb,bedCount):
    ICSEA_Value = DataBase.getICSEA_Value(suburb)
    CrimeValue = DataBase.getCrimeValue(suburb)
    predictionValue = pickel.predictValue(suburb.upper(), bedCount, ICSEA_Value[0][0], CrimeValue[0][0])
    print(predictionValue[0])
    prediction_objects = []
    year = 2025
    for i in range(0,len(predictionValue)):
        prediction_object = Entity.Prediction(year, predictionValue[i])
        prediction_objects.append(prediction_object)
        year = year + 1
    return  prediction_objects