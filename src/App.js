import React from "react";
import "./flat-remix.css";

import "./App.css";

import "react-vis/dist/style.css";
import "chartist/dist/chartist.css";

import update from "immutability-helper";
import cookie from "react-cookies";

import Instruments from "./components/instruments/Instruments";
import SettingsDialog from "./components/skeletons/SettingsDialog";
import StatusBar from "./components/statusbar/StatusBar";
import MyLoginForm from "./components/login/MyLoginForm";
import Logo from "./components/logo/Logo";

import Wrench from "./assets/wrench.svg";
import Done from "./assets/done.svg";

import DeltaAssembler from "delta-processor";

import WebSocketManager from "./components/managers/WebSocketManager";
import LoginManager from "./components/managers/LoginManager";
import LayoutManager from "./components/managers/LayoutManager";

import Package from "../package.json";

export const appName = Package.name;
export const appVersion = Package.version;

const COOKIE_USERNAME = "username";
const endpoint = "/signalk/v1";

class App extends React.Component {
	constructor(props) {
		super(props);

		let url = window.location.href;
		let ws = "ws:" + url.split(":")[1] + ":3000";
		const HTTPServerRoot = "http:" + ws.split(":").slice(1, 10).join(":");

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
				animationsAccordingToChargingStatus: false,
			},

			websocket: {
				status: WebSocketManager.STATUS_UNKNOWN,
			},

			instruments: [],

			signalkState: {
				vessels: {
					self: {},
				},
			},
		};
		const webSocketUrl = this.state.settings.serverAddress;

		this.deltaAssembler = new DeltaAssembler(HTTPServerRoot, signalkState => this.setState({ signalkState }));
		this.socketManager = new WebSocketManager(
			webSocketUrl,
			delta => this.deltaAssembler.onDelta(delta),
			status => this.setState({ websocket: { status } }),
			endpoint + "/stream/?subscribe=none"
		);
		this.layoutManager = new LayoutManager(appName, appVersion, this.isProduction ? "" : HTTPServerRoot);

		this.isProduction = props.production;
	}

	saveUsername(username) {
		cookie.save(COOKIE_USERNAME, username);
	}

	static getColors(darkMode) {
		if (darkMode) {
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
		if (this.isProduction) {
			LoginManager.testLoginValidity(this.state.login.username).then(valid => {
				this.setState(oldState =>
					update(oldState, {
						login: {
							waiting: { $set: false },
							loggedIn: { $set: valid },
						},
					})
				);
			});
		} else {
			this.setState(oldState =>
				update(oldState, {
					login: {
						waiting: { $set: false },
						loggedIn: { $set: true },
					},
				})
			);
		}

		this.layoutManager.getInstruments(this.state.login.username).then(instruments => {
			this.setState({ instruments });
		});

		this.socketManager.open();

		if (this.state.settings.animationsAccordingToChargingStatus) {
			try {
				navigator
					.getBattery()
					.then(battery => {
						const setCharging = charging =>
							this.setState(oldState =>
								update(oldState, {
									settings: {
										animation: { $set: charging },
									},
								})
							);
						let charging = battery.charging;
						if (battery.level > 0.98) charging = true;
						setCharging(charging);

						battery.addEventListener("chargingchange", () => {
							let charging = battery.charging;
							if (battery.level > 0.98) charging = true;
							setCharging(charging);
						});
					})
					.catch(console.error);
			} catch (e) {
				console.error(e);
			}
		}
	}

	render() {
		const colors = App.getColors(this.state.settings.darkMode);

		const onSetSettingsPaneOpen = open => {
			this.setState({ settingsPaneOpen: open });
		};

		const getInitialSettings = () => ({
			animation: this.state.settings.animation,
			darkMode: this.state.settings.darkMode,
			serverAddress: this.state.settings.serverAddress,
			animationsAccordingToChargingStatus: this.state.settings.animationsAccordingToChargingStatus,
		});

		const onInstrumentAdded = instrument => {
			this.setState(
				oldState => ({ instruments: oldState.instruments.concat(instrument) }),
				() => this.layoutManager.saveInstruments(this.state.login.username, this.state.instruments)
			);
		};

		const onInstrumentRemoved = index => {
			console.log("Instrument removed", index);
			this.setState(
				oldState => ({ instruments: oldState.instruments.slice(0, index).concat(oldState.instruments.slice(index + 1)) }),
				() => this.layoutManager.saveInstruments(this.state.login.username, this.state.instruments)
			);
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
				() => this.layoutManager.saveInstruments(this.state.login.username, this.state.instruments)
			);
		};

		const onLogin = (username, password) => {
			LoginManager.login(username, password).then(status => {
				console.log(status);
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
					this.layoutManager.getInstruments(username).then(instruments => {
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
				style={parentStyle}
				colors={colors}
				onLogin={onLogin}
				loggedIn={this.state.login.loggedIn}
				waiting={this.state.login.waiting}
				code={this.state.login.code}>
				<div className="instruments" style={parentStyle}>
					<SettingsDialog
						isModalOpen={this.state.settingsPaneOpen}
						requestClosing={() => onSetSettingsPaneOpen(false)}
						initialValues={getInitialSettings()}
						onSettingsUpdate={newSettings => {
							this.socketManager.changeAddress(newSettings.serverAddress);
							this.setState({ settings: newSettings });
						}}
						colors={colors}
						appElement={this}
					/>
					<StatusBar
						signalkState={this.state.signalkState}
						socketStatus={this.state.websocket.status}
						colors={colors}
						darkMode={this.state.settings.darkMode}
						onLogout={() => {
							LoginManager.logout();
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

export default App;
