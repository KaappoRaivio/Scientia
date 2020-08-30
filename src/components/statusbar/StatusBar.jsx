import React from "react";
import Clock from "./Clock";

import "./StatusBar.css";
import Weather from "./Weather";

import "../../assets/weather-icons-master/css/weather-icons.min.css";
import Logout from "./Logout";
import ConnectionStatus from "./ConnectionStatus";

const StatusBar = ({ colors, darkMode, signalkState, onLogout, socketStatus, apiKey }) => {
	// console.log(signalkState)
	return (
		<div className="statusbar-parent with-shadow">
			<div className="statusbar-left">
				<ConnectionStatus connectionStatus={socketStatus} />
				<Clock />
			</div>
			<div className="statusbar-right">
				<Weather signalkState={signalkState} colors={colors} darkMode={darkMode} apiKey={apiKey} />
				<Logout onLogout={onLogout} />
			</div>
		</div>
	);
};

export default StatusBar;
