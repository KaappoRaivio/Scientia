import requests, pprint, yaml

root = "localhost"

def login(s, username, password):
	return s.post(f"http://{root}:3000/signalk/v1/auth/login", json={"username": username, "password": password})

def get(s, username, path):
	return s.get(f"http://{root}:3000/signalk/v1/applicationData/user/signalk-scientia-kraivio/0.2.1/{username}/{path}")

def set(s, username, path, json):
	return s.post(f"http://{root}:3000/signalk/v1/applicationData/user/signalk-scientia-kraivio/0.2.1/{username}/{path}", json=json)


s = requests.Session()
username = "scientia-test"
password = "scientia-best"

# username = "scientia-test"
# password = "scientia-best"
#
# username = "nohyphen"
# password = "nohyphen"
print(login(s, username, password))
print(set(s, username, "layout", [{'type': 'single', 'instruments': [{'component': 'CompassContainer', 'additionalProps': {}}]}]))
print(get(s, username, "layout"), get(s, username, "layout").json())
