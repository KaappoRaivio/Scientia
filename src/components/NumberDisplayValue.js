import React from "react";

import "./numberdisplay.css"

const NumberDisplayValue = ({value, upperBound, decimalPlaces, suffix}) => {
    let wholePart = Math.floor(value).toFixed(0).padStart((upperBound + "").length, " ").replace("-", "–");
    let decimalPart = (Math.abs(((value - Math.trunc(value)) * 10 ** decimalPlaces)).toFixed(0) + "").slice(0, decimalPlaces);


    return <div className="value">
        <h1>
            {"​" + wholePart}
        </h1>
        <span>
            .{decimalPart}
            {suffix + " "}
        </span>
    </div>
}

export default NumberDisplayValue;