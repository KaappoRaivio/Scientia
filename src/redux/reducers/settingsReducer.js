import { DARK_MODE, SETTINGS_PANE_OPEN, UPDATE_SETTINGS } from "../actions/actions";
import update from "immutability-helper";
const getColors = darkMode => {
	if (darkMode) {
		return {
			primary: "#f00",
			secondary: "#444",
			background: "#000",

			accent1: "rgb(0, 50, 150)",
			accent2: "rgb(0, 50, 220)",

			valueNormal: "rgba(0, 0, 0,0)",
			valueAlert: "#dd0",
			valueWarn: "#d80",
			valueAlarm: "#d00",
			valueEmergency: "#f0f",
		};
	} else {
		return {
			primary: "#000",
			secondary: "#000",
			background: "#fff",

			accent1: "rgb(0, 50, 150)",
			accent2: "rgb(0, 50, 220)",

			valueNormal: "rgba(0, 0, 0, 0)",
			// valueNormal: "lightgreen",
			valueAlert: "#ff0",
			valueWarn: "#f70",
			valueAlarm: "#f00",
			valueEmergency: "#f0f",
		};
	}
};
const getAddress = host => {
	return {
		ws: `ws://${host}:3000`,
		http: `http://${host}:3000`,
		host,
	};
};

const initialState = {
	settingsPaneOpen: false,
	appearance: {
		darkMode: false,
		colors: getColors(false),
	},
	performance: {
		animation: false,
		animationsAccordingToChargingStatus: true,
	},
	connection: {
		address: getAddress(window.location.hostname),
	},
	general: {},
};

const mergeFormResult = (state, formResult) => {
	let updatedSettings = state;

	if (formResult.animation != null) {
		updatedSettings = update(updatedSettings, { performance: { animation: { $set: formResult.animation } } });
	}
	if (formResult.animationsAccordingToChargingStatus != null) {
		updatedSettings = update(updatedSettings, {
			performance: { animationsAccordingToChargingStatus: { $set: formResult.animationsAccordingToChargingStatus } },
		});
	}
	if (formResult.darkMode != null) {
		updatedSettings = update(updatedSettings, {
			appearance: { darkMode: { $set: formResult.darkMode }, colors: { $set: getColors(formResult.darkMode) } },
		});
	}
	if (formResult.serverAddress) {
		updatedSettings = update(updatedSettings, { connection: { address: { $set: getAddress(formResult.serverAddress) } } });
	}

	return updatedSettings;
};

const settingsReducer = (settingsState = initialState, action) => {
	switch (action.type) {
		case DARK_MODE:
			return update(settingsState, {
				appearance: {
					darkMode: { $set: action.darkMode },
					colors: { $set: getColors(action.darkMode) },
				},
			});
		case SETTINGS_PANE_OPEN:
			return update(settingsState, {
				settingsPaneOpen: { $set: action.open },
			});
		case UPDATE_SETTINGS:
			return mergeFormResult(settingsState, action.settings);
		default:
			return settingsState;
	}
};

export default settingsReducer;
