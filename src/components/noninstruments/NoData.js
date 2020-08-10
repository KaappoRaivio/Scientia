import React from "react";

import PropTypes from "prop-types";

import "./NoData.css";

const NoData = ({ height, width, colors, reasons }) => (
	<div style={{ height: height, width: width }}>
		<div className="no-data-parent">
			<div
				className="no-data"
				style={{ backgroundColor: colors["valueAlert"] }}
			>
				No data{" "}
				{reasons && reasons.length && `, missing ${reasons.join(", ")}`}
			</div>
		</div>
	</div>
);

NoData.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	colors: PropTypes.object.isRequired,
	reasons: PropTypes.arrayOf(PropTypes.string),
};

export default NoData;
