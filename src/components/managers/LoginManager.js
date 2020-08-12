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
		return fetch("/signalk/v1/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, password }),
		}).then(response => {
			console.log(response);
			if (response.status === 200) {
				console.log("Successfully logged in!");
			} else {
				console.log(`There was a problem with login: ${response.status}`);
			}
			return response.status;
		});
	}

	static logout() {
		fetch("/signalk/v1/auth/logout", {
			method: "PUT",
		}).then(console.log);
	}
}

export default LoginManager;
