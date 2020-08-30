import requests, pprint, yaml



#a = s.post("http://localhost:3000/signalk/v1/applicationData/user/appname/1.0/test", json={"foo": 4, "bar": 5})
#print(a)

s = requests.Session()
a = s.post("http://localhost:3000/signalk/v1/auth/login", json={"username": "user", "password": "user"})
# b = s.get("http://localhost:3000/signalk/v1/applicationData/user/scientia/0.1.0/layout")
c = s.post("http://localhost:3000/signalk/v1/applicationData/user/scientia/0.1.0/layout", json=[])
d = s.post("http://localhost:3000/signalk/v1/applicationData/user/scientia/0.1.0/apiKey", json={})
# =yaml.load("""[
#             {
#                 type: "quadrant",
#                 instruments: [
#                     {
#                         component: "CompassContainer",
#                         additionalProps: {}
#                     },
#                     {
#                         component: "TridataContainer",
#                         additionalProps: {
#                             paths: [
#                                 "environment.depth.belowTransducer",
#                                 "navigation.speedOverGround",
#                                 "performance.polarSpeed",
#                                 "navigation.trip.log"
#                             ],
#                         }
#                     },
#                     {
#                         component: "GaugeContainer",
#                         additionalProps: {
#                             path: "environment.depth.belowTransducer"
#                         }
#                     }
#                 ]
#             },
#             {
#                 type: "quadrant",
#                 instruments: [
#                     {
#                         component: "WindContainer",
#                         additionalProps: {}
#                     },
#                     {
#                         component: "CompassContainer",
#                         additionalProps: {}
#                     },
#                     {
#                         component: "TridataContainer",
#                         additionalProps: {
#                             paths: ["environment.depth.belowTransducer",
#                                 "navigation.speedOverGround",
#                                 "performance.polarSpeed",
#                                 "navigation.trip.log"
#                             ],
#                         }
#                     },
#                 ]
#             },
#             {
#                 type: "single",
#                 instruments: [
#                     {
#                         component: "GaugeContainer",
#                         additionalProps: {
#                             path: "performance.polarSpeedRatio"
#                         }
#                     }
#                 ]
#             }]"""))

# pprint.pprint(b.json())

print(c)

