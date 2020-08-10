import React from "react";
import "./flat-remix.css";

import "./App.css";

import "react-vis/dist/style.css";
import "chartist/dist/chartist.css";

import fallbackInstruments from "./assets/fallbackInstruments.json";

import Instruments from "./components/instruments";
import Logo from "./components/Logo";
import MyModal from "./components/MyModal";

import Wrench from "./assets/wrench.svg";
import Done from "./assets/done.svg";
import Package from "../package.json";
import StatusBar from "./components/misc/StatusBar";
import MyLoginForm from "./components/logic/MyLoginForm";

import cookie from "react-cookies";
import DeltaAssembler from "delta-processor";
import WebSocketManager from "./WebSocketManager";
import _ from "underscore";

export const appName = Package.name;
export const appVersion = Package.version;

const COOKIE_USERNAME = "username";
const endpoint = "/signalk/v1";

class App extends React.Component {
	constructor(props) {
		super(props);

		let url = window.location.href;
		let ws = "ws:" + url.split(":")[1] + ":3000";
		// let ws = "ws://192.168.1.151:3000"
		const HTTPServerRoot = "http:" + ws.split(":").slice(1, 10).join(":");
		this.deltaAssembler = new DeltaAssembler(HTTPServerRoot, signalkState => this.setState({ signalkState }));
		const webSocketUrl = ws + endpoint + "/stream/?subscribe=none";
		this.socketManager = new WebSocketManager(webSocketUrl, delta => this.deltaAssembler.onDelta(delta));

		this.state = {
			layoutEditingEnabled: false,
			settingsPaneOpen: false,

			login: {
				waiting: true,
				loggedIn: null,
				code: null,
				username: cookie.load(COOKIE_USERNAME),
			},

			settings: {
				serverAddress: ws,
				darkMode: false,
				animation: false,
				animationsAccordingToChargingStatus: true,
			},

			instruments: [],

			signalkState: {
				vessels: {
					self: {},
				},
			},
		};
	}

	saveUsername(username) {
		cookie.save(COOKIE_USERNAME, username);
	}

	getColors() {
		if (this.state.settings.darkMode) {
			return {
				primary: "#f00",
				secondary: "#444",
				background: "#000",

				accent1: "rgb(0, 50, 150)",
				accent2: "rgb(0, 50, 220)",

				valueNormal: "rgba(0, 0, 0,0)",
				valueAlert: "#dd0",
				valueWarn: "#d80",
				valueAlarm: "#d00",
				valueEmergency: "#f0f",
			};
		} else {
			return {
				primary: "#000",
				secondary: "#000",
				background: "#fff",

				accent1: "rgb(0, 50, 150)",
				accent2: "rgb(0, 50, 220)",

				valueNormal: "rgba(0, 0, 0, 0)",
				// valueNormal: "lightgreen",
				valueAlert: "yellow",
				valueWarn: "orange",
				valueAlarm: "red",
				valueEmergency: "purple",
			};
		}
	}

	componentDidMount() {
		if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
			this.setState(oldState => ({
				instruments: fallbackInstruments,
				login: _.extend(oldState.login, {
					waiting: false,
					loggedIn: true,
				}),
			}));
		} else {
			testLoginValidity(this.state.login.username).then(valid => {
				this.setState(oldState => ({
					login: _.extend(oldState.login, {
						waiting: false,
						loggedIn: valid,
					}),
				}));
				if (valid) {
					getInstruments(this.state.login.username).then(instruments => {
						console.log(instruments);
						this.setState({ instruments });
					});
				}
			});
		}

		this.socketManager.open();

		if (this.state.settings.animationsAccordingToChargingStatus) {
			try {
				navigator
					.getBattery()
					.then(battery => {
						this.setState({ animation: battery.charging });
					})
					.catch(console.error);
			} catch (e) {
				console.error(e);
			}
		}
	}

	render() {
		const colors = this.getColors();

		const onSetSettingsPaneOpen = open => {
			this.setState({ settingsPaneOpen: open });
		};

		const onSettingsChange = newSettings => {
			this.setState({
				settings: newSettings,
			});
		};

		const getInitialSettings = () => ({
			animation: this.state.settings.animation,
			darkMode: this.state.settings.darkMode,
			serverAddress: this.state.settings.serverAddress,
			animationsAccordingToChargingStatus: this.state.settings.animationsAccordingToChargingStatus,
		});

		const onInstrumentAdded = instrument => {
			this.setState(
				oldState => ({
					instruments: oldState.instruments.concat(instrument),
				}),
				() => {
					saveInstruments(this.state.login.username, this.state.instruments);
				}
			);
		};

		const onInstrumentRemoved = index => {
			console.log("Instrument removed", index);
			this.setState(
				oldState => ({
					instruments: oldState.instruments.slice(0, index).concat(oldState.instruments.slice(index + 1)),
				}),
				() => {
					saveInstruments(this.state.login.username, this.state.instruments);
				}
			);
			console.log(this.state);
		};

		const onInstrumentChanged = (index, instrument) => {
			console.log("Instrument changed", index, instrument);
			this.setState(
				oldState => ({
					instruments: oldState.instruments
						.slice(0, index)
						.concat(instrument)
						.concat(oldState.instruments.slice(index + 1)),
				}),
				() => {
					saveInstruments(this.state.login.username, this.state.instruments);
				}
			);
		};

		const onLogin = (username, password) => {
			login(username, password).then(status => {
				if (status === 200) {
					this.setState({
						login: {
							waiting: false,
							loggedIn: true,
							code: null,
							username,
						},
					});
					this.saveUsername(username);
					getInstruments(username).then(instruments => {
						console.log(instruments);
						this.setState({ instruments });
					});
				} else {
					this.setState({
						login: {
							waiting: false,
							loggedIn: false,
							code: status,
							username,
						},
					});
				}
			});

			this.socketManager.open();
		};

		const parentStyle = {
			stroke: colors.primary,
			fill: colors.background,
			color: colors.primary,
			backgroundColor: colors.background,
		};

		return (
			<MyLoginForm
				colors={colors}
				onLogin={onLogin}
				loggedIn={this.state.login.loggedIn}
				waiting={this.state.login.waiting}
				code={this.state.login.code}>
				<div className="instruments" style={parentStyle}>
					<MyModal
						isModalOpen={this.state.settingsPaneOpen}
						requestClosing={() => onSetSettingsPaneOpen(false)}
						initialValues={getInitialSettings()}
						onSettingsUpdate={onSettingsChange}
						colors={colors}
						appElement={this}
					/>
					<StatusBar
						signalkState={this.state.signalkState}
						colors={colors}
						darkMode={this.state.settings.darkMode}
						onLogout={() => {
							logout();
							this.socketManager.close();
							this.setState({
								login: { waiting: false, loggedIn: false },
							});
						}}
					/>
					<Instruments
						settings={this.state.settings}
						colors={colors}
						instruments={this.state.instruments}
						onInstrumentAdded={onInstrumentAdded}
						onInstrumentRemoved={onInstrumentRemoved}
						onInstrumentChanged={onInstrumentChanged}
						layoutEditingEnabled={this.state.layoutEditingEnabled}
						loggedIn={this.state.login.loggedIn}
						signalkState={this.state.signalkState}
					/>
					<div className="open-menu with-shadow">
						<button className="open-menu-wrapper" onClick={() => onSetSettingsPaneOpen(true)}>
							configure
						</button>
						<ToggleLayoutEditing
							editingEnabled={this.state.layoutEditingEnabled}
							onChanged={layoutEditingEnabled => this.setState({ layoutEditingEnabled })}
						/>
					</div>
					<Logo />
				</div>
			</MyLoginForm>
		);
	}
}

const ToggleLayoutEditing = ({ editingEnabled, onChanged }) => {
	return (
		<div onClick={() => onChanged(!editingEnabled)} className="configure-layout-wrapper">
			<img className="configure-layout" src={editingEnabled ? Done : Wrench} alt="enable layout configuration" width="auto" />
		</div>
	);
};

const login = (username, password) => {
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
};

const logout = () => {
	fetch("/signalk/v1/auth/logout", {
		method: "PUT",
	}).then(console.log);
};

const testLoginValidity = username => {
	return fetch(`/signalk/v1/applicationData/${username}/${appName}/${appVersion}/layout`)
		.then(res => {
			console.log(res);
			return res;
		})
		.then(res => res.status === 200);
};

const saveInstruments = (username, instruments) => {
	fetch(`/signalk/v1/applicationData/${username}/${appName}/${appVersion}/layout`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(instruments),
	}).then(response =>
		response.ok ? console.log("Saved instruments successfully!") : console.log("There was a problem saving the insruments: " + response.status)
	);
};

const getInstruments = username => {
	return fetch(`/signalk/v1/applicationData/${username}/${appName}/${appVersion}/layout`)
		.then(response => {
			console.log(response);
			if (response.status === 200) {
				return response.json();
			} else {
				throw new Error("Problem with response: " + response.status);
			}
		})
		.catch(error => fallbackInstruments);
};

export default App;
