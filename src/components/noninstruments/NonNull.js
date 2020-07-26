import React from 'react';
import NoData from "./NoData";
import PropTypes from "prop-types"

const NonNull = ({children, colors, height, width, ...rest}) => {
    let missing = [];

    for (let key in rest) {
        if (rest[key] == null) {
            missing.push(key);
        }

    }

    if (missing.length) {
        console.log(missing)
        return <NoData colors={colors} height={height} width={width} reasons={missing} />
    } else {
        return children
    }
};

NonNull.propTypes = {
    children: PropTypes.arrayOf(React.Component).isRequired,
    colors: PropTypes.object.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired
}


export default NonNull;