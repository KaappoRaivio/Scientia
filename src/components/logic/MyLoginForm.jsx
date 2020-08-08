import React, {Component} from 'react';

import { appName, appVersion } from "../../App";
import {componentTypes} from "@data-driven-forms/react-form-renderer";
import SettingsForm from "../../SettingsForm";

import "./MyLoginForm.css"
import validatorTypes from "@data-driven-forms/react-form-renderer/dist/cjs/validator-types";

class MyLoginForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedIn: null,
            waiting: true
        };
    }

    componentDidMount() {
        testLoginValidity("user")
            .then(loggedIn => this.setState({loggedIn, waiting: false}));

        // login("user", "user")
        //     .then(res => res.status === 200)
        //     .then(loggedIn => this.setState({loggedIn}))
    }

    render() {
        const { children, colors } = this.props;
        const { loggedIn, waiting } = this.state;
        if (waiting) {
            return <div>...</div>
        }

        if (loggedIn) {
            return children;
        }

        const onLoginPress = ({username, password}) => {
            console.log(username, password);
            login(username, password)
                .then(res => {
                    console.log(res);
                    return res.status === 200;
                })
                .then(loggedIn => this.setState({loggedIn}))
        }

        return (
            <div className="loginform-parent">
                <div className="loginform">
                    <SettingsForm requestClosing={() => {}} colors={colors} schema={schema} onSettingsUpdate={onLoginPress} initialValues={{}}/>
                </div>
            </div>
        )
    }
}

const testLoginValidity = username => {
    return fetch(`http://localhost:3000/signalk/v1/applicationData/${username}/${appName}/${appVersion}/layout`)
        .then(res => {
            console.log(res);
            return res;
        })
        .then(res => res.status === 200)
}

const login = (username, password) => {
    return fetch("http://localhost:3000/signalk/v1/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({username, password})
    }).then(response => {
        console.log(response)
        if (response.ok) {
            console.log("Successfully logged in!");
        } else {
            console.log(`There was a problem with login: ${response.status}`)
        }
        return response
    });
}

const schema = {
    title: "Log in",
    explanation: "Please supply login credentials for a valid account on your SignalK server.",
    fields: [
        {
            component: componentTypes.TEXT_FIELD,
            name: "username",
            label: "Your username",
            validate: [
                {
                    type: validatorTypes.REQUIRED,
                }
            ]
        },
        {
            component: componentTypes.TEXT_FIELD,
            name: "password",
            label: "Your password",
            type: "password",
            validate: [
                {
                    type: validatorTypes.REQUIRED,
                }
            ]
        }
    ],
    dontShowApply: true,
    dontShowCancel: true,
    okButtonText: "Log in"
}


export default MyLoginForm;