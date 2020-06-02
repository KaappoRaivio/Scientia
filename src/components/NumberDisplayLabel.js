import React from "react";

import "./numberdisplay.css"

const NumberDisplayLabel = ({ legend, unit }) => {
    return <div>
        {legend}
        <i>
            {", " + unit}
        </i>
    </div>
}

export default NumberDisplayLabel;