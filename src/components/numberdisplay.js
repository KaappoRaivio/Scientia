import React from 'react';
import "./numberdisplay.css";


const NumberDisplay = (props) => {
    let wholePart = Math.floor(props.value).toFixed(0).padStart((props.upperBound + "").length, /*"⠀"*/ "_").replace("-", "–");
    let decimalPart = (Math.abs(((props.value - Math.trunc(props.value)) * 10 ** props.decimalPlaces)).toFixed(0) + "").slice(0, props.decimalPlaces);


    return (
        <div className="displayContainer" style={{width: `${props.width}px`, height: `${props.height}px`}}>

            <div className="value">
                <h1>
                    {wholePart}
                </h1>
                <span>
                    .{decimalPart}
                    {props.suffix + " "}
                    </span>
            </div>
            <div className="label">
                {props.legend}
                <i>
                    {", " + props.unit}
                </i>
            </div>
        </div>
    );
}

export default NumberDisplay;
