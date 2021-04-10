import React, { useEffect, useState } from "react";
import LayoutModel from "../../models/LayoutModel";
import WebSocketModel from "../../models/WebSocketModel";
import DeltaAssembler from "delta-processor";
import { useDispatch, useSelector } from "react-redux";
import { updateConnectionStatus, updateInstrumentLayout, updateSignalkState } from "../../redux/actions/actions";
import PropTypes from "prop-types";

const useSignalkState = (address, HTTPServerRoot) => {
	const dispatch = useDispatch();

	const socketManagerStatus = useSelector(state => state.connection.status);
	const signalkState = useSelector(store => store.signalkState);

	useEffect(() => {
		const deltaAssembler = new DeltaAssembler(HTTPServerRoot, fullState => dispatch(updateSignalkState(fullState)), undefined, 1000);
		const websocketManager = new WebSocketModel(
			address,
			delta => deltaAssembler.onDelta(delta),
			newStatus => dispatch(updateConnectionStatus(newStatus))
		);
		websocketManager.open();
	}, [HTTPServerRoot, address, dispatch]);

	return { signalkState, connectionStatus: socketManagerStatus };
};

const useInstrumentLayoutManager = (appName, appVersion, endPoint, production, username) => {
	const dispatch = useDispatch();
	const instruments = useSelector(state => state.instrumentLayout);

	const [layoutManager] = useState(() => new LayoutModel(appName, appVersion, endPoint, production));
	useEffect(() => {
		layoutManager.getInstruments(username).then(instruments => {
			dispatch(updateInstrumentLayout(instruments));
		});
	}, [appName, appVersion, dispatch, endPoint, layoutManager, production, username]);

	useEffect(() => {
		layoutManager.saveInstruments(username, instruments);
	}, [instruments, layoutManager, username]);

	return { instruments };
};

const SignalkDataManager = ({ children, appName, appVersion, endPoint, production, username }) => {
	const { instruments } = useInstrumentLayoutManager(appName, appVersion, endPoint, production, username);

	const { ws, http } = useSelector(state => state.settings.connection.address);
	const { signalkState, connectionStatus } = useSignalkState(ws, http);

	return React.Children.map(children, child => {
		if (React.isValidElement(child)) {
			return React.cloneElement(child, { instruments, signalkState, connectionStatus });
		} else {
			return child;
		}
	});
};

SignalkDataManager.propTypes = {
	children: PropTypes.array.isRequired,
	appName: PropTypes.string.isRequired,
	appVersion: PropTypes.string.isRequired,
	endPoint: PropTypes.string.isRequired,
	production: PropTypes.bool.isRequired,
	username: PropTypes.string.isRequired,
};

export default SignalkDataManager;
