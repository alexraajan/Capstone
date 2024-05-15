class School:

    def __init__(self, name, level, street, postcode, website, email, icsea, latitude, longitude, subType, LBOTE, indigenous, enrollment):
        self.name = name
        self.level = level
        self.street = street
        self.postcode = postcode
        self.website = website
        self.email = email
        self.icsea = icsea
        self.latitude = latitude
        self.longitude = longitude
        self.subType = subType
        self.LBOTE = LBOTE
        self.indigenous = indigenous
        self.enrollment = enrollment


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
