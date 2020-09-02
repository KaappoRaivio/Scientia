import fallbackInstruments from "../../assets/fallbackInstruments.json";

class LayoutManager {
	constructor(appName, appVersion, baseUrl = "", isProduction = true) {
		this.appName = appName;
		this.appVersion = appVersion;
		this.baseUrl = baseUrl;
		this.isProduction = isProduction;
		console.log(this.isProduction);
	}

	saveInstruments(username, instruments) {
		fetch(`${this.baseUrl}/signalk/v1/applicationData/user/${this.appName}/${this.appVersion}/${username}/layout`, {
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
		return fetch(`${this.baseUrl}/signalk/v1/applicationData/user/${this.appName}/${this.appVersion}/${username}/layout`)
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
				return this.isProduction ? [] : fallbackInstruments;
			});
	}

	storeApiKey(username, key) {
		return fetch(`${this.baseUrl}/signalk/v1/applicationData/user/${this.appName}/${this.appVersion}/${username}/apiKey`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ apiKey: key }),
		}).then(response => {
			response.ok ? console.log("Saved the API key successfully!") : console.log("There was a problem saving the API key: " + response.status);
			return response.status === 200;
		});
	}

	getApiKey(username) {
		return fetch(`${this.baseUrl}/signalk/v1/applicationData/user/${this.appName}/${this.appVersion}/${username}/apiKey`)
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
