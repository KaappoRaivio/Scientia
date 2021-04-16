export const SIGNALK_DELTA = 0;
export const updateSignalkState = content => {
	return { type: SIGNALK_DELTA, content };
};

export const UPDATE_CONNECTION_STATUS = 90;
export const updateConnectionStatus = newStatus => {
	return { type: UPDATE_CONNECTION_STATUS, status: newStatus };
};
