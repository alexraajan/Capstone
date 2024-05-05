class School:
    def __init__(self, name, level, street, postcode, phone, email):
        self.name = name
        self.level = level
        self.street = street
        self.postcode = postcode
        self.phone = phone
        self.email = email

class Crime:
    def __init__(self, crime_Subcategory, total_count):
        self.crime_Subcategory = crime_Subcategory
        self.total_count = total_count

class Suburb:
    def __init__(self, name):
        self.name = name

class Prediction:
    def __init__(self, year, predictedProce):
        self.year = year
        self.predictedPrice = predictedProce
