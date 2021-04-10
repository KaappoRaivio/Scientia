import React, { useEffect, useState } from "react";

import { componentTypes } from "@data-driven-forms/react-form-renderer";
import SettingsForm from "../settings/SettingsForm";

import "./LoginManager.css";
import LoginModel from "../../models/LoginModel";
import cookie from "react-cookies";
import { useDispatch, useSelector } from "react-redux";
import { updateUserLoggedIn } from "../../redux/actions/actions";

import schema from "../../assets/schemas/loginSchema.json";

const COOKIE_USERNAME = "username";

const useLogin = (username, password, apiKey, endPoint) => {
	const dispatch = useDispatch();
	const { loggedIn, waiting, code, userRequestedLogout } = useSelector(state => state.login);

	useEffect(() => {
		if (username != null) {
			LoginModel.testLoginValidity(username, endPoint).then(valid => {
				dispatch(updateUserLoggedIn(username, valid));
			});
		} else {
			dispatch(updateUserLoggedIn(username, false));
		}
	}, [username, endPoint, dispatch]);

	useEffect(() => {
		if (username != null && password != null && !waiting) {
			LoginModel.login(username, password, endPoint).then(status => {
				console.log(status);
				if (status === 200) {
					console.log("SHould be logged int");
					dispatch(updateUserLoggedIn(username, true, 200, apiKey));
					cookie.save(COOKIE_USERNAME, username, { sameSite: "strict" });
				} else {
					dispatch(updateUserLoggedIn(username, false, status));
				}
			});
		}
	}, [username, password, waiting, endPoint, apiKey, dispatch]);

	useEffect(() => {
		if (userRequestedLogout) {
			LoginModel.logout().then(status => {
				dispatch(updateUserLoggedIn(null, false, null, null));
			});
			console.log("Logging out ");
		}
	}, [dispatch, userRequestedLogout]);

	return { waiting, loggedIn, code };
};

const LoginManager = ({ colors, endPoint, children, production }) => {
	const [{ username, password, apiKey }, setCredentials] = useState({ username: cookie.load(COOKIE_USERNAME) });
	const { waiting, loggedIn, code } = useLogin(username, password, apiKey, endPoint);
	console.log(loggedIn);

	if (waiting) {
		return <div>...</div>;
	}

	// if (loggedIn || !production) {
	if (loggedIn) {
		// console.log(children);
		return React.Children.map(children, child => {
			if (React.isValidElement(child)) {
				return React.cloneElement(child, { production, username, endPoint });
			} else {
				return child;
			}
		});
	}

	return (
		<div className="loginform-parent">
			<div className="loginform">
				<SettingsForm requestClosing={() => {}} colors={colors} schema={schema} onSubmit={setCredentials} initialValues={{}} />
			</div>
			{code === 401 && <span>Wrong username or password</span>}
		</div>
	);
};

export default LoginManager;
