import fallbackInstruments from "../../assets/fallbackInstruments.json";
import CompassContainer from "../instruments/compass/CompassContainer";
import WindContainer from "../instruments/wind/WindContainer";
import TridataContainer from "../instruments/tridata/TridataContainer";
import GaugeContainer from "../instruments/gauge/GaugeContainer";
import VisualiserContainer from "../instruments/visualiser/VisualiserContainer";
import AddInstrument from "../instruments/helpers/AddInstrument";

const serializeInstruments = instruments => {
	let s = JSON.stringify(
		instruments.map(instrument => ({
			instruments: instrument.instruments.map(_instrument => ({
				additionalProps: _instrument.additionalProps,
				component: classToString(_instrument.component),
			})),
			type: instrument.type,
		}))
	);
	console.log(s, JSON.stringify(instruments));
	return s;
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
				this.saveInstruments(username, []);
				return this.isProduction ? [] : fallbackInstruments;
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

export const classToString = string =>
	({
		[CompassContainer]: "CompassContainer",
		[WindContainer]: "WindContainer",
		[TridataContainer]: "TridataContainer",
		[GaugeContainer]: "GaugeContainer",
		[VisualiserContainer]: "VisualiserContainer",
		[AddInstrument]: "AddInstrument",
	}[string]);

export default LayoutModel;
