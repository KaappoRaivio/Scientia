import React from "react";
import "./flat-remix.css";

import "./App.css";

import "react-vis/dist/style.css";
// import "chartist/dist/chartist.css";
import update from "immutability-helper";
import LoginManager from "./components/login/LoginManager";

import WebSocketManager from "./components/managers/WebSocketManager";

import Package from "../package.json";
import Main from "./Main";
import SignalkDataManager from "./SignalkDataManager";

export const APP_NAME = Package.name;
export const APP_VERSION = Package.version;

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			layoutEditingEnabled: false,
			settingsPaneOpen: false,
			apiKey: "",

			login: {
				waiting: true,
				loggedIn: null,
				code: null,
				// username: cookie.load(COOKIE_USERNAME),
			},

			settings: {
				// serverAddress: ws,
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
		// const webSocketUrl = this.state.settings.serverAddress;
		// this.isProduction = props.production;

		// this.deltaAssembler = new DeltaAssembler(
		// 	HTTPServerRoot,
		// 	signalkState => {
		// 		this.setState({ signalkState });
		// 	},
		// 	undefined,
		// 	1000
		// );
		// this.socketManager = new WebSocketManager(
		// 	webSocketUrl,
		// 	delta => this.deltaAssembler.onDelta(delta),
		// 	status => this.setState({ websocket: { status } }),
		// "/signalk/v1/stream/?subscribe=none";
		// );
		// this.layoutManager = new LayoutModel(APP_NAME, APP_VERSION, this.isProduction ? "" : HTTPServerRoot, this.isProduction);
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
				valueAlert: "#ff0",
				valueWarn: "#f70",
				valueAlarm: "#f00",
				valueEmergency: "#f0f",
			};
		}
	}

	componentDidMount() {
		if (this.isProduction) {
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

		// this.layoutManager.getInstruments(this.state.login.username).then(instruments => {
		// 	this.setState({ instruments, layoutEditingEnabled: !instruments.length });
		// });
		// this.layoutManager.getApiKey(this.state.login.username).then(apiKey => {
		// 	this.setState({ apiKey });
		// });
		//
		// this.socketManager.open();
		//
		// if (this.state.settings.animationsAccordingToChargingStatus) {
		// 	try {
		// 		navigator
		// 			.getBattery()
		// 			.then(battery => {
		// 				const setCharging = charging =>
		// 					this.setState(oldState =>
		// 						update(oldState, {
		// 							settings: {
		// 								animation: { $set: charging },
		// 							},
		// 						})
		// 					);
		// 				let charging = battery.charging;
		// 				if (battery.level > 0.98) charging = true;
		// 				setCharging(charging);
		//
		// 				battery.addEventListener("chargingchange", () => {
		// 					let charging = battery.charging;
		// 					if (battery.level > 0.98) charging = true;
		// 					setCharging(charging);
		// 				});
		// 			})
		// 			.catch(console.error);
		// 	} catch (e) {
		// 		console.error(e);
		// 	}
		// }
	}

	onSetSettingsPaneOpen = open => {
		this.setState({ settingsPaneOpen: open });
	};

	onInstrumentAdded = instrument => {
		this.setState(
			oldState => ({ instruments: oldState.instruments.concat(instrument) }),
			() => this.layoutManager.saveInstruments(this.state.login.username, this.state.instruments)
		);
	};

	onInstrumentRemoved = index => {
		console.log("Instrument removed", index);
		this.setState(
			oldState => ({ instruments: oldState.instruments.slice(0, index).concat(oldState.instruments.slice(index + 1)) }),
			() => this.layoutManager.saveInstruments(this.state.login.username, this.state.instruments)
		);
	};

	onInstrumentChanged = (index, instrument) => {
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

	setLayoutEditingEnabled = layoutEditingEnabled => {
		return this.setState({ layoutEditingEnabled });
	};
	closeSettingsPane = () => {
		this.onSetSettingsPaneOpen(false);
	};

	openSettingsPane = () => {
		this.onSetSettingsPaneOpen(true);
	};

	onSettingsUpdate = newSettings => {
		this.socketManager.changeAddress(newSettings.serverAddress);
		this.setState({ settings: newSettings });
	};
	// 743fcf245791b649c2cef6919c661f27
	render() {
		const { production, endPoint } = this.props;

		const colors = App.getColors(this.state.settings.darkMode);

		const parentStyle = {
			stroke: colors.primary,
			fill: colors.background,
			color: colors.primary,
			backgroundColor: colors.background,
		};

		return (
			// <div>asdasd</div>
			<LoginManager endPoint={endPoint} colors={colors} production={production}>
				<SignalkDataManager appName={APP_NAME} appVersion={APP_VERSION}>
					<Main parentStyle={parentStyle} colors={colors} />
				</SignalkDataManager>
				{/*<LayoutModel>*/}
				{/*	*/}
				{/*</LayoutModel>*/}
			</LoginManager>
		);
	}
}

export default App;
