import React from "react";

import PropTypes from "prop-types";

import "./NoData.css";

const NoData = ({ height, width, colors, reasons, path }) => (
	<div style={{ height: height, width: width }}>
		<div className="no-data-parent">
			<div className="no-data" style={{ backgroundColor: colors.zones["alert"] }}>
				No data {reasons && reasons.length && `, missing ${reasons.join(", ")}`}
				{path && <div style={{ fontSize: "30%" }}>{path}</div>}
			</div>
		</div>
	</div>
);

NoData.propTypes = {
	width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	colors: PropTypes.object.isRequired,
	reasons: PropTypes.arrayOf(PropTypes.string),
	path: PropTypes.string,
};

export default NoData;
