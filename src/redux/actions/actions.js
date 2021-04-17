export const SIGNALK_DELTA = "signalk-delta";
export const updateSignalkState = content => {
	return { type: SIGNALK_DELTA, content };
};

export const UPDATE_CONNECTION_STATUS = "update connection status";
export const updateConnectionStatus = newStatus => {
	return { type: UPDATE_CONNECTION_STATUS, status: newStatus };
};
