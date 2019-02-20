import re

districts = []

f = open("comhtml.txt", "r")
pattern = r"(district=)(\d{0,3})"

for x in f:
  match = re.search(pattern, x)
  districts.append(int(match.group(2)))

print(districts)


