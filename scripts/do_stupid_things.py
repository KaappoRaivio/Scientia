import requests, pprint, yaml, time

root = "localhost"

def login(s, username, password):
	return s.post(f"http://{root}:3000/signalk/v1/auth/login", json={"username": username, "password": password})

def get(s, username, path):
	return s.get(f"http://{root}:3000/signalk/v1/applicationData/user/signalk-scientia-kraivio/0.2.1/{username}/{path}")

def set(s, username, path, json):
	return s.post(f"http://{root}:3000/signalk/v1/applicationData/user/signalk-scientia-kraivio/0.2.1/{username}/{path}", json=json)

def auto(s):
	return s.put(f"http://{root}:3000/signalk/v1/api/vessels/self/steering/autopilot/state", json={"value": "auto"})

def standby(s):
	return s.put(f"http://{root}:3000/signalk/v1/api/vessels/self/steering/autopilot/state", json={"value": "standby"})

def turn(s, direction):
	return s.put(f"http://{root}:3000/signalk/v1/api/vessels/self/steering/autopilot/actions/adjustHeading", json={"value": direction})


s = requests.Session()
username = "admin"
password = "admin"

print(login(s, username, password))
print(standby(s).json())
# time.sleep(0.5)
# print(auto(s).json())
# time.sleep(1)
# print(turn(s, -10).json())

