import React from 'react';
import "./numberdisplay.css";
import NumberDisplayLabel from "./NumberDisplayLabel";
import NumberDisplayValue from "./NumberDisplayValue";


const NumberDisplay = ({decimalPlaces, height, legend, suffix, unit, upperBound, value, width}) => {

    return (
        <div className="displayContainer" style={{width: `${width}px`, height: `${height}px`}}>
            <NumberDisplayValue upperBound={upperBound} decimalPlaces={decimalPlaces} suffix={suffix} value={value} />
            <div className="label">
                <NumberDisplayLabel legend={legend} unit={unit} />
            </div>
        </div>
    );
}

export default NumberDisplay;
