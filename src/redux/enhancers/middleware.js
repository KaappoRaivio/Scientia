import LoginModel, { COOKIE_USERNAME } from "../../models/LoginModel";
import cookie from "react-cookies";
import { LOGIN } from "../actions/login";

// export const loginMiddleware = store => next => action => {
// 	console.log("Got action: ", action);
// 	switch (action.type) {
// 		case LOGIN:
// 			const status = await LoginModel.login(username, password, endpoint);
//
// 			console.log(status);
// 			if (status === 200) {
// 				cookie.save(COOKIE_USERNAME, username, { sameSite: "strict" });
// 			} else {
// 				// dispatch(updateUserLoggedIn(username, false, status));
// 			}
//
// 	}
// 	next(action);
// };
//
export const asyncFunctionMiddleware = storeAPI => next => action => {
	console.log(action, typeof action);
	if (typeof action === "function") {
		return action(storeAPI.dispatch, storeAPI.getState);
	}

	return next(action);
};
