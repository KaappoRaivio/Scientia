import { mergeNewInstrumentById, removeInstrumentById } from "../reducers/instrumentLayoutReducer";
import LayoutManager from "../../models/LayoutModel";

export const UPDATE_INSTRUMENT_LAYOUT = "update-instrument-layout";
const updateInstrumentLayout = newLayout => {
	return { type: UPDATE_INSTRUMENT_LAYOUT, layout: newLayout };
};
export const changeInstrumentLayout = newLayout => async (dispatch, getState) => {
	const reduxState = getState();

	dispatch(updateInstrumentLayout(newLayout));
	const endpoint = reduxState.settings.connection.address.http;
	const { appName, appVersion, isProduction } = reduxState.appState.meta;
	const { username } = reduxState.login;

	const { ok, status } = await LayoutManager.saveInstruments(username, appName, appVersion, isProduction, endpoint, newLayout);

	if (ok) {
		console.log("Saved instruments successfully!", status);
	} else {
		console.log("There was a problem saving instruments, " + status);
	}
};
export const addInstrument = (id, instrument) => async (dispatch, getState) => {
	dispatch(changeInstrumentLayout(mergeNewInstrumentById(getState().instrumentLayout, id, instrument)));
};
export const removeInstrument = id => async (dispatch, getState) => {
	dispatch(changeInstrumentLayout(removeInstrumentById(getState().instrumentLayout, id)));
};
