import fallbackInstruments from "../../assets/fallbackInstruments.json";

class LayoutManager {
	constructor(appName, appVersion, baseUrl = "") {
		this.appName = appName;
		this.appVersion = appVersion;
		this.baseUrl = baseUrl;
	}

	saveInstruments(username, instruments) {
		fetch(`${this.baseUrl}/signalk/v1/applicationData/${username}/${this.appName}/${this.appVersion}/layout`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(instruments),
		}).then(response =>
			response.ok
				? console.log("Saved instruments successfully!")
				: console.log("There was a problem saving the insruments: " + response.status)
		);
	}

	getInstruments(username) {
		return fetch(`${this.baseUrl}/signalk/v1/applicationData/${username}/${this.appName}/${this.appVersion}/layout`)
			.then(response => {
				console.log(response);
				if (response.status === 200) {
					return response.json();
				} else {
					throw new Error("Problem with response: " + response.status);
				}
			})
			.catch(error => {
				this.saveInstruments(username, []);
				// return fallbackInstruments;
				return [];
			});
	}

	storeApiKey(username, key) {
		fetch(`${this.baseUrl}/signalk/v1/applicationData/${username}/${this.appName}/${this.appVersion}/apiKey`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ apiKey: key }),
		}).then(response => {
			response.ok ? console.log("Saved the API key successfully!") : console.log("There was a problem saving the API key: " + response.status);
			return response.ok;
		});
	}

	getApiKey(username) {
		return fetch(`${this.baseUrl}/signalk/v1/applicationData/${username}/${this.appName}/${this.appVersion}/apiKey`)
			.then(response => {
				console.log(response);
				if (response.status === 200) {
					return response.json();
				} else {
					throw new Error("Problem with response: " + response.status);
				}
			})
			.then(json => json.apiKey)
			.catch(error => "");
	}
}

export default LayoutManager;
