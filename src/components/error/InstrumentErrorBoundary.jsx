import React from "react";
import PropTypes from "prop-types";
import CopyToClipboard from "react-copy-to-clipboard";

import "../settings/SettingsForm.css";

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			hasError: false,
			error: null,
			// message: "",
			// errorInfo: null,
		};
	}

	// componentDidCatch(error, errorInfo) {
	// 	console.log("did catch", error, errorInfo, error.message);
	// 	this.setState({ error, errorInfo, message: error.message });
	// }

	static getDerivedStateFromError(error, errorInfo) {
		console.log("derived state");
		console.log(error);
		return { hasError: true, error };
	}

	render() {
		if (this.state.hasError) {
			return (
				// <div>
				<>
					<span>
						<b>Error: </b>
						{this.state.error.message}
						<br />
						{/*<p style={{ fontSize: "50%", overflowX: "visible" }}>{this.state.error.stack}</p>*/}
						<CopyToClipboard text={`${this.state.error.message}\n\n${this.state.error.stack} `} style={{ textAlign: "center" }}>
							<button className={"with-shadow form-cancel button"} style={{ fontSize: "50%", width: "auto" }}>
								Copy call stack to clipboard
							</button>
						</CopyToClipboard>
					</span>
					{/*<p>{this.state.errorInfo.componentStack}</p>*/}
				</>
				// </div>
			);
		} else {
			return this.props.children;
		}
	}
}

ErrorBoundary.propTypes = {};

export default ErrorBoundary;
