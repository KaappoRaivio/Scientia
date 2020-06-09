import React from 'react';
import "./numberdisplay.css";
import AutoFitTextBox from "./AutoFitTextBox";
import PropTypes from "prop-types";
import _ from "underscore";

import {checkForZones} from "./zones";

const isStillLoading = (...params) => {
    return _.any(params, param => param === null);
}

const getZoneCSSClass = (value, zones) => {
    const zone = checkForZones(zones, value);
    return "value-" + zone;
}

const NumberDisplay = ({decimalPlaces, height, label, suffix, unit, upperBound, value, width, centerLabel, zones, colors}) => {
    if (isStillLoading(decimalPlaces, label, unit, value, upperBound)) {
        return <div style={{padding: "6%"}}>Loading</div>
    }

    const actualWidth = width * 0.94;
    const actualHeight = height * 0.84;

    let valueMaxLength = upperBound.toString().length + ".".length + decimalPlaces + suffix.length;
    if (value === null) {
        value = 0;
    }

    const alarmCSSClass = getZoneCSSClass(value, zones);
    console.log(alarmCSSClass)

    return (
        <div className="numberdisplay-wrapper" style={{width: `${width}px`, height: `${height}px`}}>
            <div className={`numberdisplay-parent ${alarmCSSClass}`}>
                <svg className="numberdisplay-svg" width={`${actualWidth}px`} height={`${actualHeight}px`} fill={"black"} stroke={"none"}>
                    <g fill={colors.primary}>
                        {centerLabel ?
                            <AutoFitTextBox x="50%" y="25%" maxNumberOfDigits={label.length} value={label}
                                            initialFontSize={60} width={actualWidth * 0.94} height={actualHeight * 0.25}
                                            textAnchor={"middle"}
                            /> :
                            <AutoFitTextBox x="3%" y="25%" maxNumberOfDigits={label.length} value={label}
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

NumberDisplay.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,

    label: PropTypes.string.isRequired,
    suffix: PropTypes.string,
    unit: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,

    upperBound: PropTypes.number.isRequired,
    decimalPlaces: PropTypes.number.isRequired,

    centerLabel: PropTypes.bool,
    debug: PropTypes.bool,

    colors: PropTypes.object.isRequired
}

export default NumberDisplay;
