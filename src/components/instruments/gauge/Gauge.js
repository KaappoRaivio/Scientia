import React from "react";

import Svghelpers from "../../misc/svghelpers";
import {mod} from "mathjs";
import Needle from "../wind/Needle";
import NumberDisplay from "../../numberdisplay";

import "./gauge.css"
import NumberDisplayValue from "../../NumberDisplayValue";
import NumberDisplayLabel from "../../NumberDisplayLabel";

const Gauge = (props) => {
    const center = {x: props.width / 2, y: props.height / 2};
    const radius = props.width / 2.1;
    const radiusPercent = radius / (props.width / 2) * 100 / 2;


    let start = 135;
    let end = -135;

    let limitedValue = Math.min(props.upperBound, props.value);
    let needleAngle = ((start - end) / 180 * Math.PI) / props.upperBound * limitedValue - start / 180 * Math.PI;

    const colors = props.colors;

    let { normal, alert, warn, alarm, emergency} = props.zones;

    let normalAngle = normal.map(x => (start - end) * x);
    let alertAngle = alert.map(x => (start - end) * x);
    let warnAngle = warn.map(x => (start - end) * x);
    let alarmAngle = alarm.map(x => (start - end) * x);
    let emergencyAngle = emergency.map(x => (start - end) * x);

    let sectorWidth = props.width * 0.075;

    const divisions = props.divisions;

    const helper = new Svghelpers(false);
    console.log(colors.accent1)


    return <div className="gauge-parent" style={{width: props.width, height: props.height}}>
        <Needle angle={needleAngle} radius={radiusPercent} color={colors.accent1} animate={true} demo={false}/>
        <div className="gauge-number-display-value">
            <NumberDisplayValue
                value={props.value}
                decimalPlaces={1}
                upperBound={props.upperBound}
                suffix={""}
            />
        </div>
        <div className="gauge-number-display-unit">
            kts
        </div>
        <div className="gauge-number-display-label" >
            Wind speed
        </div>
        <svg width={props.width} height={props.height}>
            <g stroke={"none"} fill={colors.background}>
                {helper.getSector(center.x, center.y, radius, sectorWidth, start - normalAngle[0], start - normalAngle[1], "lightgreen")}
                {helper.getSector(center.x, center.y, radius, sectorWidth, start - alertAngle[0], start - alertAngle[1], "yellow")}
                {helper.getSector(center.x, center.y, radius, sectorWidth, start - warnAngle[0], start - warnAngle[1], "orange")}
                {helper.getSector(center.x, center.y, radius, sectorWidth, start - alarmAngle[0], start - alarmAngle[1], "red")}
                {helper.getSector(center.x, center.y, radius, sectorWidth, start - emergencyAngle[0], start - emergencyAngle[1], "purple")}
            </g>
            <circle stroke={colors.primary}
                fill={"none"}
                cx={center.x}
                cy={center.y}
                r={radius}
                strokeWidth={radius * 0.01}
            />

            <g stroke={"black"} strokeWidth={radius * 0.01}>
                {divisions.map((division) =>
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
            <g strokeWidth={0}>
                {helper.getSector(center.x, center.y, radius + 2, radius, start, mod(end, 360), colors.background)}
            </g>
        </svg>
    </div>



}

export default Gauge;