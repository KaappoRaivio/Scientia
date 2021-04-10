import React from "react";

import WebSocketModel from "../../models/WebSocketModel";

import connected from "../../assets/Connection status/connected.svg";
import disconnected from "../../assets/Connection status/disconnected.svg";
import unknown from "../../assets/Connection status/unknown.svg";
import error from "../../assets/Connection status/error.svg";

const mapper = {
	[WebSocketModel.STATUS_CONNECTED]: connected,
	[WebSocketModel.STATUS_DISCONNECTED]: disconnected,
	[WebSocketModel.STATUS_UNKNOWN]: unknown,
	[WebSocketModel.STATUS_ERROR]: error,
	[WebSocketModel.STATUS_CONNECTING]: error,
};

const ConnectionStatus = ({ connectionStatus }) => {
	return (
		<div style={{ marginRight: "10px", display: "inline", fontSize: "1.5em", height: "1em" }}>
			<img style={{ height: "1em" }} src={mapper[connectionStatus]} alt="" />
		</div>
	);
};

export default ConnectionStatus;
