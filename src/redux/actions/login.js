import LoginModel, { COOKIE_USERNAME } from "../../models/LoginModel";
import cookie from "react-cookies";

export const isLoggedIn = username => async (dispatch, getState) => {
	if (username == null) {
		console.log("username is null, not probing!");
		dispatch(updateLoginStatus(null, false, false));
	}
	const endpoint = getState().settings.connection.address.http;
	const loggedIn = await LoginModel.testLoginValidity(username, endpoint);

	if (loggedIn) {
		dispatch(updateLoginStatus(username, false, true));
	} else {
		dispatch(updateLoginStatus(username, false, false));
	}
};
export const login = (username, password, apiKey) => async (dispatch, getState) => {
	const endpoint = getState().settings.connection.address.http;
	const status = await LoginModel.login(username, password, endpoint);

	if (status === 200) {
		console.log("Login successful!");
		cookie.save(COOKIE_USERNAME, username, { sameSite: "strict" });
		dispatch(updateLoginStatus(username, false, true, apiKey));
	} else {
		console.log("Login unsuccessful!");
		dispatch(updateLoginStatus(username, false, false, apiKey, status));
	}
};
export const logout = () => async (dispatch, getState) => {
	const endpoint = getState().settings.connection.address.http;
	console.log("Trying to logout to endpoint ", endpoint);
	const status = await LoginModel.logout(endpoint);
	if (status === 200) {
		console.log("Successfully logged out!");
		dispatch(updateLoginStatus(null, false, false));
	} else {
		console.log(`Got status ${status} when trying to logout!`);
	}
};
export const LOGIN = 1;
const updateLoginStatus = (username, waiting, loggedIn, apiKey, statusCode) => {
	return { type: LOGIN, username, waiting, loggedIn, apiKey, code: statusCode };
};
