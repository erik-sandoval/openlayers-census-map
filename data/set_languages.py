import json
from language_codes import languages
from languages_census_data import census_data
from map_data import map_data


def set_language(arr, languageList):
    # loop though census data rows
    for data in arr:
        # if the language code is in the data it will replace it with the value of the code.
        if data[0] in languageList:
            data[0] = languageList[data[0]]
    return arr


# initiliazing the function with the census data and languages.
set_language(census_data, languages)

# empty dictionary
state_data = {}

# for it to initialize right in arcGIS web app builder, I need each language to be a property
for data in census_data:
    # loops through state names and adds to empty dict with a languages property if not in dict
    if data[2] not in state_data:
        state_data[data[2]] = {"languages": {}}


for data in census_data:
    # check if state is in dictionary
    if state_data[data[2]]:
        # check language is spoken in state by checking if value is not None
        if data[0] not in state_data[data[2]]["languages"] and data[1] != None:
            #adds language and value or language into state_data dict
            state_data[data[2]]["languages"][data[0]] = data[1]

for data in map_data["features"]:
    # check if state is in dictionary
    if state_data[data["properties"]["NAME"]]:
        # loops through states language keys and values.
        for lang_key, lang_val in state_data[data["properties"]["NAME"]]["languages"].items():
            # adds languages and value of spoken to the map_data. 
            data["properties"][lang_key.upper()] = int(lang_val)

# creating a new file to export the map_data.py contents
file = open('./data/geo_data.json', 'w')

# converting to json format
new_map_data = json.dumps(map_data)

# writing map_data to json 
file.write(f"{new_map_data}")
