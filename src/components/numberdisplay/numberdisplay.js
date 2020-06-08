import React from 'react';
import "./numberdisplay.css";
import NumberDisplayLabel from "./NumberDisplayLabel";
import NumberDisplayValue from "./NumberDisplayValue";
import ScaleText from "react-scale-text";
import AutoFitTextBox from "./AutoFitTextBox";


const NumberDisplay = ({decimalPlaces, height, legend, suffix, unit, upperBound, value, width, centerLabel, debug}) => {
    // console.log(width, height)

    const actualWidth = width * 0.94;
    const actualHeight = height * 0.84;

    let valueMaxLength = upperBound.toString().length + ".".length + decimalPlaces + suffix.length;
    if (value === null) {
        value = "-".repeat(valueMaxLength);
    }

    return (
        <div className="numberdisplay-wrapper" style={{width: `${width}px`, height: `${height}px`}}>
            <div className={`numberdisplay-parent`}>
                <svg className="numberdisplay-svg" width={`${actualWidth}px`} height={`${actualHeight}px`} fill={"black"} stroke={"none"}>
                    <g fill={"black"}>
                        {centerLabel ?
                            <AutoFitTextBox x="50%" y="25%" maxNumberOfDigits={legend.length} value={legend}
                                            initialFontSize={60} width={actualWidth * 0.94} height={actualHeight * 0.25}
                                            textAnchor={"middle"}
                            /> :
                            <AutoFitTextBox x="3%" y="25%" maxNumberOfDigits={legend.length} value={legend}
                                                 initialFontSize={60} width={actualWidth * 0.94} height={actualHeight * 0.25}
                            />

                        }

                        <AutoFitTextBox x="3%" y="90%" maxNumberOfDigits={valueMaxLength} value={value.toFixed(decimalPlaces) + suffix}
                                        initialFontSize={60} width={actualWidth * 0.57} height={actualHeight * 0.75}/>
    s
                        <AutoFitTextBox x="60%" y="90%" maxNumberOfDigits={unit.length} value={" " + unit}
                                        initialFontSize={60} width={actualWidth * 0.37} height={actualHeight / 2}/>

                    </g>
                </svg>
            </div>
        </div>
    );
}

export default NumberDisplay;
