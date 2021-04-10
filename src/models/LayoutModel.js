import fallbackInstruments from "../assets/fallbackInstruments.json";
import CompassContainer from "../components/instruments/compass/CompassContainer";
import WindContainer from "../components/instruments/wind/WindContainer";
import TridataContainer from "../components/instruments/tridata/TridataContainer";
import GaugeContainer from "../components/instruments/gauge/GaugeContainer";
import VisualiserContainer from "../components/instruments/visualiser/VisualiserContainer";
import AddInstrument from "../components/instruments/helpers/AddInstrument";

const replaceClassesWithStrings = node => {
	if (node.type === "leaf") {
		console.log(node, classToString(node.component.class));
		console.log("value: " + node.component.class);
		return {
			type: "leaf",
			component: {
				...node.component,
				class: classToString(node.component.class),
			},
		};
	} else if (node.type === "branch") {
		return {
			type: "branch",
			children: node.children.map(replaceClassesWithStrings),
		};
	}
};

const serializeInstruments = instruments => {
	return JSON.stringify(replaceClassesWithStrings(instruments));
};

class LayoutModel {
	constructor(appName, appVersion, endpoint = "", isProduction = true) {
		this.appName = appName;
		this.appVersion = appVersion;
		this.endpoint = endpoint;
		this.isProduction = isProduction;
		console.log(this.isProduction);
	}

	saveInstruments(username, instruments) {
		console.log(`${this.endpoint}/signalk/v1/applicationData/user/${this.appName}/${this.appVersion}/${username}/layout`);
		console.log(serializeInstruments(instruments));
		console.log(instruments);
		fetch(`${this.endpoint}/signalk/v1/applicationData/user/${this.appName}/${this.appVersion}/${username}/layout`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: serializeInstruments(instruments),
		}).then(response =>
			response.ok
				? console.log("Saved instruments successfully!")
				: console.log("There was a problem saving the insruments: " + response.status)
		);
	}

	async getInstruments(username) {
		const result = await fetch(`${this.endpoint}/signalk/v1/applicationData/user/${this.appName}/${this.appVersion}/${username}/layout`)
			.then(response => {
				console.log(response);
				if (response.status === 200) {
					return response.json();
				} else {
					throw new Error("Problem with response: " + response.status);
				}
			})
			.catch(error => {
				this.saveInstruments(username, { type: "branch", children: [] });
				return this.isProduction ? { type: "branch", children: [] } : fallbackInstruments;
			});

		const fillBranch = node => {
			if (node.type === "leaf") {
				node.component.class = stringToClass(node.component.class);
			} else {
				node.children.forEach(fillBranch);
			}
		};

		fillBranch(result);
		return result;
	}

	storeApiKey(username, key) {
		return fetch(`${this.endpoint}/signalk/v1/applicationData/user/${this.appName}/${this.appVersion}/${username}/apiKey`, {
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
		return fetch(`${this.endpoint}/signalk/v1/applicationData/user/${this.appName}/${this.appVersion}/${username}/apiKey`)
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
export const stringToClass = string =>
	({
		CompassContainer: CompassContainer,
		WindContainer: WindContainer,
		TridataContainer: TridataContainer,
		GaugeContainer: GaugeContainer,
		VisualiserContainer: VisualiserContainer,
		AddInstrument: AddInstrument,
	}[string]);

export const classToString = _class =>
	({
		[CompassContainer]: "CompassContainer",
		[WindContainer]: "WindContainer",
		[TridataContainer]: "TridataContainer",
		[GaugeContainer]: "GaugeContainer",
		[VisualiserContainer]: "VisualiserContainer",
		[AddInstrument]: "AddInstrument",
	}[_class]);

export default LayoutModel;
