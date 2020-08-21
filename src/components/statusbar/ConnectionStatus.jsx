import React from "react";

import WebSocketManager from "../managers/WebSocketManager";

import connected from "../../assets/Connection status/connected.svg";
import disconnected from "../../assets/Connection status/disconnected.svg";
import unknown from "../../assets/Connection status/unknown.svg";
import error from "../../assets/Connection status/error.svg";

const mapper = {
	[WebSocketManager.STATUS_CONNECTED]: connected,
	[WebSocketManager.STATUS_DISCONNECTED]: disconnected,
	[WebSocketManager.STATUS_UNKNOWN]: unknown,
	[WebSocketManager.STATUS_ERROR]: error,
	[WebSocketManager.STATUS_CONNECTING]: error,
};

const ConnectionStatus = ({ connectionStatus }) => {
	return (
<<<<<<< HEAD
		<div style={{ marginRight: "10px", display: "inline", fontSize: "1.5em", height: "1em" }}>
=======
		<div style={{ display: "inline", fontSize: "1.5em", height: "1em" }}>
>>>>>>> 0ed8e9d526855e083240a53953a854aaf2f0219d
			<img style={{ height: "1em" }} src={mapper[connectionStatus]} alt="" />
		</div>
	);
};

export default ConnectionStatus;
