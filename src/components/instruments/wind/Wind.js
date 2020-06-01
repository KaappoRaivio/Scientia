import React from 'react';

import NumberDisplay from "../../numberdisplay.js"
import Needle from "./Needle"
import Svghelper from "../../misc/svghelpers";

import "./wind.css"


const Wind = (props) => {
    const center = {x: props.width / 2, y: props.height / 2};
    const radius = Math.round(props.width / 2.1);
    const radiusPercent = radius / (props.width / 2) * 100 / 2;
    const helper = new Svghelper();

    const colors = {
        ...props.colors,
        ...getAdditionalColors(props.darkMode)
    };

    const parentStyle = {
        width: props.width,
        height: props.height,
        backgroundColor: "inherit",
        // background: "inherit",
        fill: colors.background
        ,
        position: "relative",
    };

    return (
        <div className="wind" style={parentStyle}>
            <div className="wind-speed-display-wrapper">
                <NumberDisplay className="wind-speed-display"
                    value={props.speed * 3.6 / 1.852}
                    suffix=""
                    unit="kts"
                    width={props.width / 2}
                    height={props.height * 0.25}
                    upperBound={99}
                    decimalPlaces={1}
                    fontSize={props.width / 6}
                    legend={`Wind speed (${props.speedQuality})`}
                />
            </div>

            <Needle angle={props.angleApparent} radius={radiusPercent} color={colors.accent1} animate={props.animate}/>
            <Needle angle={props.angleTrue} radius={radiusPercent} color={colors.accent2} animate={props.animate}/>

            <svg width={props.width} height={props.height}>
                <circle
                    // fill={colors.background}
                    cx={center.x}
                    cy={center.y}
                    r={radius}
                    strokeWidth={radius * 0.01}
                />


                {helper.getSector(center.x, center.y, radius, 0.025 * props.width, -props.closeHaulAngle, 0, colors.closeHaulRight)}
                {helper.getSector(center.x, center.y, radius, 0.025 * props.width, props.closeHaulAngle, 0, colors.closeHaulLeft)}

                <g fill={props.colors.primary} strokeWidth={radius * 0.01}>
                    {props.divisions.map((division) =>
                            helper
                                .drawDivision(center.x, center.y,
                                    radius,
                                    -division.lineLength * props.width * 0.1,
                                    division.numberOfDivisions,
                                    radius * 0.15,
                                    i => 2 * Math.PI / division.numberOfDivisions * i,
                                    division.textProvider,
                                    false))
                    }
                </g>
            </svg>
        </div>
    )
}

const getAdditionalColors = (darkMode) => {
    if (darkMode) {
        return {
            closeHaulRight: "rgba(0, 200, 0, 1)",
            closeHaulLeft: "rgba(255, 150, 125, 1)",
        }
    } else {
        return {
            closeHaulRight: "rgba(0, 200, 0, 0.75)",
            closeHaulLeft: "rgba(255, 150, 125, 0.75)",
        }
    }
};

export default Wind;