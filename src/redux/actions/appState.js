export const DARK_MODE = 30;
export const darkMode = darkMode => {
	return { type: DARK_MODE, darkMode };
};
export const UPDATE_SETTINGS = 32;
export const updateSettings = settings => {
	return { type: UPDATE_SETTINGS, settings };
};
export const ADD_INSTRUMENT_DIALOG_OPEN = 100;
export const addInstrumentDialogOpen = open => {
	return { type: ADD_INSTRUMENT_DIALOG_OPEN, open };
};
export const SETTINGS_PANE_OPEN = 101;
export const settingsPaneOpen = open => {
	return { type: SETTINGS_PANE_OPEN, open };
};
export const LAYOUT_EDITING_ENABLED = 102;
export const setLayoutEditingEnabled = enabled => {
	return { type: LAYOUT_EDITING_ENABLED, enabled };
};
export const APP_METADATA = 103;
export const setAppMetadata = (name, version, production) => {
	return { type: APP_METADATA, name, version, production };
};
