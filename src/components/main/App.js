import React, { useEffect } from "react";
import "../../css/flat-remix.css";

import "./App.css";

import "react-vis/dist/style.css";
// import "chartist/dist/chartist.css";
import LoginManager from "../login/LoginManager";

import Package from "../../../package.json";
import Main from "./Main";
import SignalkDataManager from "../signalk/SignalkDataManager";
import { connect, useDispatch, useSelector } from "react-redux";
import { setAppMetadata } from "../../redux/actions/appState";

export const APP_NAME = Package.name;
export const APP_VERSION = Package.version;

const App = ({ production }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setAppMetadata(APP_NAME, APP_VERSION, production));
	}, [dispatch, production]);

	const colors = useSelector(state => state.settings.appearance.colors);
	const parentStyle = {
		stroke: colors.primary,
		fill: colors.background,
		color: colors.primary,
		backgroundColor: colors.background,
	};

	return (
		<LoginManager>
			<SignalkDataManager>
				<Main parentStyle={parentStyle} />
			</SignalkDataManager>
		</LoginManager>
	);
};

export default App;
// export default connect(state => ({ colors: state.settings.appearance.colors }), { updateMeta: setAppMetadata })(App);
