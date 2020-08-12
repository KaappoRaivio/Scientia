import { appName, appVersion } from "../../App";

class LoginManager {
	static testLoginValidity(username) {
		return fetch(`/signalk/v1/applicationData/${username}/${appName}/${appVersion}/layout`)
			.then(res => {
				console.log(res);
				return res;
			})
			.then(res => res.status === 200);
	}

	static login(username, password) {
		return window
			.fetch("/signalk/v1/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			})
			.then(response => {
				if (response.status === 200) {
					console.log("Successfully logged in!");
				} else {
					console.log(`There was a problem with login: ${response.status}`);
				}
				return response.status;
			})
			.catch(e => console.log("error", e));
	}

	static logout() {
		return fetch("/signalk/v1/auth/logout", {
			method: "PUT",
		}).then(res => res.status);
	}
}

export default LoginManager;
