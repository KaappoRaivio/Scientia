import React, { useCallback, useEffect, useRef, useState } from "react";
import LayoutModel from "./components/managers/LayoutModel";
import WebSocketManager from "./components/managers/WebSocketManager";
import DeltaAssembler from "delta-processor";

const useSignalkState = (address, HTTPServerRoot) => {
	const [socketManagerStatus, setSocketManagerStatus] = useState({});
	const [signalkState, setSignalkState] = useState({ vessels: { self: {} } });

	useEffect(() => {
		const deltaAssembler = new DeltaAssembler(HTTPServerRoot, setSignalkState, undefined, 1000);
		const websocketManager = new WebSocketManager(
			address,
			delta => {
				deltaAssembler.onDelta(delta);
			},
			status => {
				// console.log(status);
				setSocketManagerStatus(status);
			},
			"/signalk/v1/stream/?subscribe=none"
		);
		websocketManager.open();
	}, [HTTPServerRoot, address]);

	return { signalkState, connectionStatus: socketManagerStatus };
};

const SignalkDataManager = ({ children, appName, appVersion, endPoint, production, username }) => {
	const [instruments, setInstruments] = useState([]);
	useEffect(() => {
		const layoutManager = new LayoutModel(appName, appVersion, endPoint, production);
		layoutManager.getInstruments(username).then(setInstruments);
	}, [appName, appVersion, endPoint, production, username]);

	let url = window.location.href;
	let ws = "ws:" + url.split(":")[1] + ":3000";
	const HTTPServerRoot = "http:" + ws.split(":").slice(1, 10).join(":");
	const { signalkState, connectionStatus } = useSignalkState(ws, HTTPServerRoot);

	return React.Children.map(children, child => {
		if (React.isValidElement(child)) {
			return React.cloneElement(child, { instruments, signalkState, connectionStatus });
		} else {
			return child;
		}
	});
};

SignalkDataManager.propTypes = {};

export default SignalkDataManager;
