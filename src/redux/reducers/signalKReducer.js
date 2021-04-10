import { SIGNALK_DELTA } from "../actions/actions";

const initialState = {
	vessels: { self: {} },
};

const signalKReducer = (signalKState = initialState, action) => {
	switch (action.type) {
		case SIGNALK_DELTA:
			return action.content;
		// return signalKState;
		default:
			return signalKState;
	}
};

export default signalKReducer;
