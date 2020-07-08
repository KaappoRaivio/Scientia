import React from "react";
import {mod} from "mathjs";


import "./compass.css"
import NumberDisplay from "../../numberdisplay/NumberDisplay";
import {LineDivisions} from "../../misc/svghelpers";

const Compass = (props) => {
    const center = getCenter(props);
    const radius = getRadius(props);
    const colors = props.colors;
    const heading = (props.heading || {}).value;

    const parentStyle = {
        width: props.width + "px",
        height: props.height + "px",
        color: colors.primary,
        backgroundColor: colors.background
    };

    let compassRotationStyle;
    if (props.animate) {
        compassRotationStyle = {transform: `rotate(${-heading}deg)`};
    } else {
        compassRotationStyle = {transform: `rotate(${-heading}deg)`, transition: "none"};
    }

    return <div className="compass" style={parentStyle}>
        <NumberDisplay
            className="number"
            value={heading}
            suffix="°"
            units="cog"
            width={props.width}
            height={props.height / 3}
            upperBound={360}
            decimalPlaces={1}
            // fontSize={props.width / 4}
            label="Heading"
            colors={colors}
            darkMode={props.darkMode}
            displayScale={{"lower": 0, "upper": 360, "type": "linear"}}
        />

        <svg className="compassRose" width={props.width} height={props.height} style={compassRotationStyle}>
            <circle
                cx={center.x}
                cy={center.y}
                r={radius}
                fill={colors.background}
                stroke={colors.primary}
                strokeWidth={radius * 0.01}
            />
            <g fill={colors.primary} stroke={colors.primary} strokeWidth={radius * 0.01}>
                    <LineDivisions center={center} radius={radius} divisions={props.divisions} rotateText={true}/>
            </g>
        </svg>
    </div>
}

const getRadius = (props) => {
    return Math.max(props.width / 2 - 2, 0)
}

const getCenter = (props) => {
    return {x: props.width / 2, y: props.height / 2};
}

export default Compass;