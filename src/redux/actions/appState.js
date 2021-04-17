export const UPDATE_SETTINGS = "update-settings";
export const updateSettings = settings => {
	return { type: UPDATE_SETTINGS, settings };
};
export const ADDINSTRUMENT_DIALOG_OPEN = "addinstrument-dialog-open";
export const addInstrumentDialogOpen = open => {
	return { type: ADDINSTRUMENT_DIALOG_OPEN, open };
};
export const SETTINGS_DIALOG_OPEN = "settingspane-open";
export const settingsDialogOpen = open => {
	return { type: SETTINGS_DIALOG_OPEN, open };
};
export const LAYOUT_EDITING_ENABLED = "layout-editing-enabled";
export const setLayoutEditingEnabled = enabled => {
	return { type: LAYOUT_EDITING_ENABLED, enabled };
};
export const APP_METADATA = "app-metadata";
export const setAppMetadata = (name, version, production) => {
	return { type: APP_METADATA, name, version, production };
};
