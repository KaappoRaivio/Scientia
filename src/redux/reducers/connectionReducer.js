import WebSocketModel from "../../models/WebSocketModel";
import { UPDATE_CONNECTION_STATUS } from "../actions/actions";

const initialState = {
	status: WebSocketModel.STATUS_UNKNOWN,
};

const connectionReducer = (connection = initialState, action) => {
	switch (action.type) {
		case UPDATE_CONNECTION_STATUS:
			return { status: action.status };
		default:
			return connection;
	}
};

export default connectionReducer;
