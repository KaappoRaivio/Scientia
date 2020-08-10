import React, { Component } from "react";

import { componentTypes } from "@data-driven-forms/react-form-renderer";
import SettingsForm from "../../SettingsForm";

import "./MyLoginForm.css";
import validatorTypes from "@data-driven-forms/react-form-renderer/dist/cjs/validator-types";

class MyLoginForm extends Component {
	render() {
		const {
			children,
			colors,
			onLogin,
			loggedIn,
			waiting,
			code,
		} = this.props;

		if (waiting) {
			return <div>...</div>;
		}

		if (loggedIn) {
			return children;
		}

		const onLoginPress = ({ username, password }) => {
			onLogin(username, password);
		};

		return (
			<div className="loginform-parent">
				<div className="loginform">
					<SettingsForm
						requestClosing={() => {}}
						colors={colors}
						schema={schema}
						onSettingsUpdate={onLoginPress}
						initialValues={{}}
					/>
				</div>
				{code === 401 && <span>Wrong username or password</span>}
			</div>
		);
	}
}

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
	],
	dontShowApply: true,
	dontShowCancel: true,
	okButtonText: "Log in",
};

export default MyLoginForm;
