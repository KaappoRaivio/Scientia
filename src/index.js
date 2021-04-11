import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./components/main/App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import store from "./redux/store/store";

// import "./flat-remix.css";

let production = !(!process.env.NODE_ENV || process.env.NODE_ENV === "development");

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App production={production} />
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
