import React from "react";
import {mod} from "mathjs";


import "./compass.css"
import NumberDisplay from "../../numberdisplay/numberdisplay";
import {LineDivisions} from "../../misc/svghelpers";

const Compass = (props) => {
    const center = getCenter(props);
    const radius = getRadius(props);

    // const divisions = [
    //     [12, 0.75, i => mod(180 - 360 / 12 * i, 360)],
    //     [36, 0.5, i => ""],
    //     [144, 0.25, i => ""]
    // ];


    const colors = props.colors;

    const parentStyle = {
        width: props.width + "px",
        height: props.height + "px",
        color: colors.primary,
        backgroundColor: colors.background
    };

    let compassRotationStyle;
    if (props.animate) {
        compassRotationStyle = {transform: `rotate(${-props.heading}deg)`};
    } else {
        compassRotationStyle = {transform: `rotate(${-props.heading}deg)`, transition: "none"};
    }

    return <div className="compass" style={parentStyle}>
        <NumberDisplay
            className="number"
            value={props.heading}
            suffix="°"
            unit="T"
            width={props.width}
            height={props.height / 4}
            upperBound={360}
            decimalPlaces={1}
            fontSize={props.width / 4}
            legend="Heading"
        />

        <svg className="compassRose" width={props.width} height={props.height} style={compassRotationStyle}>
            <circle
                cx={center.x}
                cy={center.y}
                r={radius}
                fill={colors.background}
                stroke={colors.primary}
                strokeWidth={2}
            />
            <g fill={colors.primary} stroke={colors.primary} strokeWidth={radius * 0.01}>
                    <LineDivisions center={center} radius={radius} divisions={props.divisions} rotateText={true}/>
            </g>
        </svg>
    </div>
}

// const getCircleRadius = (canvasWidth, offsetY) => {
//     return Math.sqrt((canvasWidth / 2) ** 2 + offsetY ** 2) / 1.05
// }

const getRadius = (props) => {
    return Math.max(props.width / 2 - 2, 0)
}

const getCenter = (props) => {
    return {x: props.width / 2, y: props.height / 2};
}

// const getCompassLineMaxLength = (props) => {
//     return props.width / 2 / 10;
// }
export default Compass;