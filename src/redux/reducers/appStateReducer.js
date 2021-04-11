import { ADD_INSTRUMENT_DIALOG_OPEN, APP_METADATA, LAYOUT_EDITING_ENABLED, SETTINGS_PANE_OPEN } from "../actions/actions";

import update from "immutability-helper";

const initialState = {
	settingsPaneOpen: false,
	addInstrumentDialogOpen: false,
	layoutEditingEnabled: false,
	// layoutEditingEnabled: false,
	meta: {
		appVersion: null,
		appName: null,
		isProduction: null,
	},
};

const appStateReducer = (appState = initialState, action) => {
	switch (action.type) {
		case ADD_INSTRUMENT_DIALOG_OPEN:
			return { ...appState, addInstrumentDialogOpen: action.open };
		case SETTINGS_PANE_OPEN:
			return { ...appState, settingsPaneOpen: action.open };
		case LAYOUT_EDITING_ENABLED:
			return { ...appState, layoutEditingEnabled: action.enabled };
		case APP_METADATA:
			return update(appState, {
				meta: {
					appVersion: { $set: action.version },
					appName: { $set: action.name },
					isProduction: { $set: action.production },
				},
			});
		default:
			return appState;
	}
};

export default appStateReducer;
