import { combineReducers } from "redux";

import signalKReducer from "./signalKReducer";
import loginReducer from "./loginReducer";
import settingsReducer from "./settingsReducer";
import instrumentLayoutReducer from "./instrumentLayoutReducer";
import connectionReducer from "./connectionReducer";
import appStateReducer from "./appStateReducer";

const rootReducer = combineReducers({
	signalkState: signalKReducer,
	login: loginReducer,
	settings: settingsReducer,
	instrumentLayout: instrumentLayoutReducer,
	connection: connectionReducer,
	appState: appStateReducer,
});

export default rootReducer;
