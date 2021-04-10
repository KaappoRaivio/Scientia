import React from "react";
import "../../css/flat-remix.css";

import "./App.css";

import "react-vis/dist/style.css";
// import "chartist/dist/chartist.css";
import LoginManager from "../login/LoginManager";

import WebSocketModel from "../../models/WebSocketModel";

import Package from "../../../package.json";
import Main from "./Main";
import SignalkDataManager from "../signalk/SignalkDataManager";
import { connect } from "react-redux";

export const APP_NAME = Package.name;
export const APP_VERSION = Package.version;

class App extends React.Component {
	// 743fcf245791b649c2cef6919c661f27
	render() {
		const { production, endPoint, colors } = this.props;

		const parentStyle = {
			stroke: colors.primary,
			fill: colors.background,
			color: colors.primary,
			backgroundColor: colors.background,
		};

		return (
			<LoginManager endPoint={endPoint} colors={colors} production={production}>
				<SignalkDataManager appName={APP_NAME} appVersion={APP_VERSION}>
					<Main parentStyle={parentStyle} colors={colors} />
				</SignalkDataManager>
			</LoginManager>
		);
	}
}

// export default App;
export default connect(state => ({ colors: state.settings.appearance.colors }), null)(App);
