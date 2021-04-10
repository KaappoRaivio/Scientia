class LoginModel {
	static testLoginValidity(username, endPoint) {
		console.log(`${endPoint}/loginStatus`);
		return fetch(`${endPoint}/loginStatus`)
			.then(res => res.json())
			.then(json => {
				console.log(json);
				return json.status === "loggedIn";
			});
	}

	static login(username, password, endPoint) {
		return fetch(`${endPoint}/signalk/v1/auth/login`, {
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
				return response.json();
			})
			.then(json => {
				console.log(json);
				return json.statusCode || 200;
			})

			.catch(e => console.log("error", e));
	}

	static logout() {
		return fetch("/signalk/v1/auth/logout", {
			method: "PUT",
		}).then(res => res.status);
	}
}

export default LoginModel;
