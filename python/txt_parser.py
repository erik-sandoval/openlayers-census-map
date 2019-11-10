# function I created to help parse through data.
# Was having issues with pdf import so I copy pasted to txt

pdf_file = open(
    r"/Users/erik/GitHub/arcGIS-Project/python/language_codes.txt", "r")

sorted_list = {}


for line in pdf_file:

    split_line = line.split()
    sorted_list[int(split_line[0])] = split_line[1]

print(sorted_list)

# Used outputted data in src/data/language_codes.js to create language objects.
