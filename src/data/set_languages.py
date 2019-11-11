import json
from language_codes import languages
from languages_census_data import census_data
from map_data import map_data


def set_language(arr, languageList):
    for data in arr:
        if data[0] in languageList:
            data[0] = languageList[data[0]]
    return arr


set_language(census_data, languages)

state_data = {}

for data in census_data:
    if data[2] not in state_data:
        state_data[data[2]] = {"languages": {}}


for data in census_data:
    if state_data[data[2]]:
        if data[0] not in state_data[data[2]]["languages"] and data[1] != None:
            state_data[data[2]]["languages"][data[0]] = data[1]

for data in map_data["features"]:
    if state_data[data["properties"]["NAME"]]:
        data["properties"]["LANGUAGES"] = state_data[data["properties"]
                                                     ["NAME"]]['languages']

file = open('/Users/erik/GitHub/arcGIS-Project/src/data/geo_data.json', 'w')

file.write(f"{map_data}")