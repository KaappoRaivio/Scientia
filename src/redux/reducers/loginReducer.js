import { LOGIN } from "../actions/login";

const initialState = {
	waiting: true,
	loggedIn: null,
	code: null,
	username: null,
	apiKey: null,
};

const loginReducer = (loginState = initialState, action) => {
	switch (action.type) {
		case LOGIN:
			console.log("Updating login status");
			return {
				username: action.username,
				loggedIn: action.loggedIn,
				waiting: false,
				code: action.code || loginState.code,
				apiKey: action.apiKey || loginState.apiKey,
			};
		default:
			return loginState;
	}
};

export default loginReducer;
