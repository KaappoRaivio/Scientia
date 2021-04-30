import fallbackInstruments from "../assets/fallbackInstruments.json";
import CompassContainer from "../components/instruments/compass/CompassContainer";
import WindContainer from "../components/instruments/wind/WindContainer";
import TridataContainer from "../components/instruments/tridata/TridataContainer";
import GaugeContainer from "../components/instruments/gauge/GaugeContainer";
import VisualiserContainer from "../components/instruments/visualiser/VisualiserContainer";
import AddInstrument from "../components/instruments/helpers/AddInstrument";

import _ from "lodash";

const replaceClassesWithStrings = node => {
	if (node.type === "leaf") {
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
			layout: node.layout,
			children: node.children.map(replaceClassesWithStrings),
		};
	}
};

const serializeInstruments = instruments => {
	return JSON.stringify(replaceClassesWithStrings(instruments));
};

class LayoutModel {
	static saveInstruments(username, appName, appVersion, isProduction, endpoint, instruments) {
		return fetch(`${endpoint}/signalk/v1/applicationData/user/${appName}/${appVersion}/${username}/layout`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: serializeInstruments(instruments),
		}).then(response => ({ ok: response.ok, status: response.status }));
	}

	static async getInstruments(username, appName, appVersion, isProduction, endpoint) {
		const result = await fetch(`${endpoint}/signalk/v1/applicationData/user/${appName}/${appVersion}/${username}/layout`)
			.then(response => {
				if (response.status === 200) {
					return response.json();
				} else {
					throw new Error("Problem with response: " + response.status);
				}
			})
			.catch(error => {
				console.log("Didn't find any instruments, probably in dev!");
				if (isProduction) {
					console.log("Fixing corrupt save data!");
					LayoutModel.saveInstruments(username, appName, appVersion, isProduction, endpoint, { type: "branch", children: [] });
				}

				return isProduction ? { type: "branch", children: [] } : _.cloneDeep(fallbackInstruments);
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

	static storeApiKey(username, key) {
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

	static getApiKey(username) {
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

export const classToString = _class => {
	switch (_class) {
		case CompassContainer:
			return "CompassContainer";
		case WindContainer:
			return "WindContainer";
		case TridataContainer:
			return "TridataContainer";
		case GaugeContainer:
			return "GaugeContainer";
		case VisualiserContainer:
			return "VisualiserContainer";
		case AddInstrument:
			console.log("Warning! serialising AddInstrument!");
			return "AddInstrument";
		default:
			throw new Error(`Unknown class ${_class}!`);
	}
};

export default LayoutModel;
