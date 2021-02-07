import React, { useEffect, useState } from "react";

import { componentTypes } from "@data-driven-forms/react-form-renderer";
import SettingsForm from "../settings/SettingsForm";

import "./LoginManager.css";
import validatorTypes from "@data-driven-forms/react-form-renderer/dist/cjs/validator-types";
import LoginModel from "../managers/LoginModel";
import update from "immutability-helper";
import cookie from "react-cookies";

const COOKIE_USERNAME = "username";

// saveUsername(username) {
// 	cookie.save(COOKIE_USERNAME, username);
// }
//
//
// onLogin ({ username, password, apiKey }) {
// 	LoginModel.login(username, password).then(status => {
// 		console.log(status);
// 		if (status === 200) {
// 			this.setState({
// 				login: {
// 					waiting: false,
// 					loggedIn: true,
// 					code: null,
// 					username,
// 				},
// 			});
// 			this.saveUsername(username);
// 			this.layoutManager.getInstruments(username).then(instruments => {
// 				this.setState({ instruments, layoutEditingEnabled: !instruments.length });
// 			});
// 			this.layoutManager.storeApiKey(username, apiKey).then(ok => {
// 				console.log(ok, apiKey);
// 				this.setState({ apiKey });
// 			});
// 		} else {
// 			this.setState({
// 				login: {
// 					waiting: false,
// 					loggedIn: false,
// 					code: status,
// 					username,
// 				},
// 			});
// 		}
// 	});
//
// 	this.socketManager.open();
// };
// onLogout () {
// 	LoginModel.logout();
// 	this.socketManager.close();
// 	this.setState({
// 		login: { waiting: false, loggedIn: false },
// 	});
// };

// LoginModel.testLoginValidity(this.state.login.username).then(valid => {
// 	this.setState(oldState =>
// 		update(oldState, {
// 			login: {
// 				waiting: { $set: false },
// 				loggedIn: { $set: valid },
// 			},
// 		})
// 	);
// });

const useLogin = (username, password, endPoint) => {
	const [waitingLoginStatusInfo, setWaitingLoginStatusInfo] = useState(true);
	const [loggedIn, setLoggedIn] = useState(false);
	const [code, setCode] = useState(null);

	useEffect(() => {
		if (username != null) {
			LoginModel.testLoginValidity(username, endPoint).then(valid => {
				setLoggedIn(valid);
				setWaitingLoginStatusInfo(false);
			});
		} else {
			setLoggedIn(false);
			setWaitingLoginStatusInfo(false);
		}
	}, [username, endPoint]);

	useEffect(() => {
		if (username != null && password != null && !waitingLoginStatusInfo) {
			LoginModel.login(username, password, endPoint).then(status => {
				if (status === 200) {
					setLoggedIn(true);
					cookie.save(COOKIE_USERNAME, username, { sameSite: "strict" });
				} else {
					setCode(status);
				}
			});
		}
	}, [username, password, waitingLoginStatusInfo, endPoint]);

	return { waiting: waitingLoginStatusInfo, loggedIn, code };
};

const LoginManager = ({ colors, endPoint, children, production }) => {
	// const { children, colors, onLogin, loggedIn, waiting, code } = props;
	// username: cookie.load(COOKIE_USERNAME),

	const [{ username, password, apiKey }, setCredentials] = useState({ username: cookie.load(COOKIE_USERNAME) });
	const { waiting, loggedIn, code } = useLogin(username, password, endPoint);

	if (waiting) {
		return <div>...</div>;
	}

	if (loggedIn || !production) {
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
				<SettingsForm requestClosing={() => {}} colors={colors} schema={schema} onSettingsUpdate={setCredentials} initialValues={{}} />
			</div>
			{code === 401 && <span>Wrong username or password</span>}
		</div>
	);
};

const schema = {
	title: "Log in",
	explanation:
		"Please supply login credentials for a valid account on your SignalK server. These credentials are used for storing the settings of the app in the server. Your password will not be stored on the device. \n\n Hint: if you want to log in less often, you can increase the 'Login session timeout' parameter in the server's security settings.",
	fields: [
		{
			component: componentTypes.TEXT_FIELD,
			name: "username",
			label: "Your username",
			validate: [
				{
					type: validatorTypes.REQUIRED,
				},
			],
		},
		{
			component: componentTypes.TEXT_FIELD,
			name: "password",
			label: "Your password",
			type: "password",
			validate: [
				{
					type: validatorTypes.REQUIRED,
				},
			],
		},
		{
			component: componentTypes.TEXT_FIELD,
			name: "weatherApiKey",
			label: "Api key to OpenWeatherMap, if you have it.",
		},
	],
	dontShowApply: true,
	dontShowCancel: true,
	okButtonText: "Log in",
};

export default LoginManager;
