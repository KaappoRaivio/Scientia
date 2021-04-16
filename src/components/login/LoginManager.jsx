import React, { useEffect, useState } from "react";

import { componentTypes } from "@data-driven-forms/react-form-renderer";
import SettingsForm from "../settings/SettingsForm";

import "./LoginManager.css";
import { COOKIE_USERNAME } from "../../models/LoginModel";
import cookie from "react-cookies";
import { useDispatch, useSelector } from "react-redux";

import schema from "../../assets/schemas/loginSchema.json";
import { isLoggedIn, login } from "../../redux/actions/login";

const useLogin = (username, password, apiKey) => {
	const dispatch = useDispatch();
	const { loggedIn, waiting, code } = useSelector(state => state.login);

	useEffect(() => {
		console.log(`Probing login with username ${username}`);
		if (waiting) {
			dispatch(isLoggedIn(username));
		}
	}, [dispatch, username, waiting]);

	const performLogin = () => {
		if (username != null && password != null) {
			console.log("Logging in with username", username, password);
			dispatch(login(username, password, apiKey));
		} else {
			console.log("Username or password are null, not logging in !");
		}
	};

	useEffect(performLogin, [username, password, apiKey, dispatch]);

	return { waiting, loggedIn, code, performLogin };
};

const LoginManager = ({ colors, children }) => {
	const production = useSelector(state => state.appState.meta.isProduction);
	const [{ username, password, apiKey }, setCredentials] = useState({ username: cookie.load(COOKIE_USERNAME) });

	const { waiting, loggedIn, code, performLogin } = useLogin(username, password, apiKey);

	if (waiting) {
		return <div>Please wait...</div>;
	}

	if (loggedIn || !production) {
		return children;
	}

	return (
		<div className="loginform-parent">
			<div className="loginform">
				<SettingsForm
					requestClosing={() => {}}
					colors={colors}
					schema={schema}
					onSubmit={values => {
						setCredentials(values);
						performLogin();
					}}
					initialValues={{}}
				/>
			</div>
			{code === 401 && <span>Wrong username or password</span>}
		</div>
	);
};

export default LoginManager;
