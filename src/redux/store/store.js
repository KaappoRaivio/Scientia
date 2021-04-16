import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import rootReducer from "../reducers/reducers";

export default createStore(rootReducer, applyMiddleware(thunk));
