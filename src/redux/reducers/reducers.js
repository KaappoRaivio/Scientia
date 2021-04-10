import { combineReducers } from "redux";

import signalKReducer from "./signalKReducer";
import loginReducer from "./loginReducer";
import settingsReducer from "./settingsReducer";
import instrumentLayoutReducer from "./instrumentLayoutReducer";
import connectionReducer from "./connectionReducer";

const reducers = combineReducers({
	signalkState: signalKReducer,
	login: loginReducer,
	settings: settingsReducer,
	instrumentLayout: instrumentLayoutReducer,
	connection: connectionReducer,
});

export default reducers;
