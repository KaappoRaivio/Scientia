import React from 'react';
import "./numberdisplay.css";
import AutoFitTextBox from "./AutoFitTextBox";
import PropTypes from "prop-types";
import _ from "underscore";

import {checkForZones} from "./zones";
import NoData from "../misc/NoData";

const isNull = obj => {
    if (obj != null && typeof obj === "object") {
        for(let member in obj) {
            if (obj[member] == null) {
                return true;
            }
        }
        return false;
    } else {
        return obj == null;
    }
}

const isStillLoading = (...params) => {
    // console.log(params.map(param => isNull(param)), params)

    return _.any(params, param => isNull(param));
}

const getActiveZone = (value, zones) => {
    const zone = checkForZones(zones, value);
    return "value" + zone[0].toUpperCase() + zone.slice(1);
}

const NumberDisplay = ({decimalPlaces, height, label, suffix, units, value, displayScale, width, centerLabel, zones, colors, debug, darkMode}) => {
    if (isStillLoading(decimalPlaces, label, units, value, displayScale)) {
        return <NoData style={{fontWeight: "bold"}} width={width} height={height} colors={colors}/>
    }

    const actualWidth = width * 0.94;
    const actualHeight = height * 0.84;

    let valueMaxLength = Math.max(Math.trunc(displayScale.upper).toString().length, Math.trunc(displayScale.lower).toString().length);

    let textMaxLength = valueMaxLength + ".".length + decimalPlaces + suffix.length;
    if (value === null) {
        value = 0;
    }

    const activeZone = getActiveZone(value, zones || []);
    if (debug) {
        // console.log(alarmCSSClass)
    }

    const alarmStyle = {
        backgroundColor: colors[activeZone],
        animation: ["valueAlarm", "valueEmergency"].includes(activeZone) ? "blink 0.5s infinite steps(1, end)" : "none",
    }

    return (
        <div className="numberdisplay-wrapper" style={{width: `${width}px`, height: `${height}px`}}>
            <div className={`numberdisplay-parent`} style={alarmStyle}>
                <svg className="numberdisplay-svg" width={`${actualWidth}px`} height={`${actualHeight}px`} fill={"black"} stroke={"none"}>
                    <g fill={activeZone !== "valueNormal" && darkMode ? colors.secondary : colors.primary}>
                    {/*<g fill={colors.secondary}>*/}
                        {centerLabel ?
                            <AutoFitTextBox x="50%" y="25%" maxNumberOfDigits={label.length} value={label}
                                            initialFontSize={60} width={actualWidth * 0.94} height={actualHeight * 0.25}
                                            textAnchor={"middle"}
                            /> :
                            <AutoFitTextBox x="3%" y="25%" maxNumberOfDigits={label.length} value={label}
                                            initialFontSize={60} width={actualWidth * 0.94} height={actualHeight * 0.25}
                            />

                        }

                        <AutoFitTextBox x="3%" y="90%" maxNumberOfDigits={textMaxLength} value={value.toFixed(decimalPlaces) + suffix}
                                        initialFontSize={60} width={actualWidth * 0.57} height={actualHeight * 0.75} fontWeight={"bold"}/>
                        <AutoFitTextBox x="60%" y="90%" maxNumberOfDigits={units.length} value={" " + units}
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
    units: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,

    decimalPlaces: PropTypes.number.isRequired,

    centerLabel: PropTypes.bool,
    debug: PropTypes.bool,

    colors: PropTypes.object.isRequired,
    displayScale: PropTypes.object.isRequired,
    zones: PropTypes.array,
    darkMode: PropTypes.bool.isRequired,
}

export default NumberDisplay;
