import re

districts = []

f = open("comhtml.txt", "r")
pattern = r"(district=)(\d{0,3})"

for x in f:
  match = re.search(pattern, x)
  if match:
    districts.append(int(match.group(2)))

print(districts)
print(len(districts))


