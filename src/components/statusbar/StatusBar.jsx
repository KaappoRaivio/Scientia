import React from "react";
import Clock from "./Clock";

import "./StatusBar.css";
import Weather from "./Weather";

import "../../assets/weather-icons-master/css/weather-icons.min.css";
import Logout from "./Logout";
import ConnectionStatus from "./ConnectionStatus";
import { useSelector } from "react-redux";

const StatusBar = props => {
	const socketStatus = useSelector(state => state.connection.status);
	const signalkState = useSelector(state => state.signalkState);
	const colors = useSelector(state => state.settings.appearance.colors);
	const darkMode = useSelector(state => state.settings.appearance.darkMode);
	const apiKey = useSelector(state => state.login.apiKey);

	return (
		<div className="statusbar-parent with-shadow">
			<div className="statusbar-left">
				<ConnectionStatus connectionStatus={socketStatus} />
				<Clock />
			</div>
			<div className="statusbar-right">
				<Weather signalkState={signalkState} colors={colors} darkMode={darkMode} apiKey={apiKey} />
				<Logout />
			</div>
		</div>
	);
};

export default StatusBar;
