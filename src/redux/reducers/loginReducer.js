import { LOGOUT, UPDATE_LOGIN } from "../actions/actions";

const initialState = {
	waiting: true,
	loggedIn: null,
	code: null,
	username: null,
	apiKey: null,
	userRequestedLogout: false,
};

const loginReducer = (loginState = initialState, action) => {
	switch (action.type) {
		case UPDATE_LOGIN:
			console.log("Updating login");
			console.log({
				username: action.username,
				loggedIn: action.loggedIn,
				waiting: false,
				code: action.code || loginState.code,
				apiKey: action.apiKey || loginState.apiKey,
				userRequestedLogout: false,
			});
			return {
				username: action.username,
				loggedIn: action.loggedIn,
				waiting: false,
				code: action.code || loginState.code,
				apiKey: action.apiKey || loginState.apiKey,
				userRequestedLogout: false,
			};
		case LOGOUT:
			return {
				...loginState,
				userRequestedLogout: true,
			};
		default:
			return loginState;
	}
};

export default loginReducer;
