import React from "react";

import PropTypes from "prop-types";

import "./NoData.css"

const NoData = ({height, width, colors}) => (<div style={{height: height, width: width}}>
    <div className="no-data-parent">
        <div className="no-data" style={{backgroundColor: colors["valueAlert"]}}>
            No data
        </div>
    </div>
</div>)

NoData.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    colors: PropTypes.object.isRequired
}

export default NoData;