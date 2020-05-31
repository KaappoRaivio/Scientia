import React from 'react';
import "./numberdisplay.css";


const NumberDisplay = ({decimalPlaces, height, legend, suffix, unit, upperBound, value, width}) => {
    let wholePart = Math.floor(value).toFixed(0).padStart((upperBound + "").length, " ").replace("-", "–");
    let decimalPart = (Math.abs(((value - Math.trunc(value)) * 10 ** decimalPlaces)).toFixed(0) + "").slice(0, decimalPlaces);


    return (
        <div className="displayContainer" style={{width: `${width}px`, height: `${height}px`}}>

            <div className="value">
                <h1>
                    {"​" + wholePart}
                </h1>
                <span>
                    .{decimalPart}
                    {suffix + " "}
                    </span>
            </div>
            <div className="label">
                {legend}
                <i>
                    {", " + unit}
                </i>
            </div>
        </div>
    );
}

export default NumberDisplay;
