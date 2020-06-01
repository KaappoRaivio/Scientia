import React from "react";

import Svghelpers from "../../misc/svghelpers";
import {mod} from "mathjs";

const Gauge = (props) => {
    const center = {x: props.width / 2, y: props.height / 2};
    let radius = center.x;


    let start = 135;
    let end = -135;

    let { normal, alert, warn, alarm, emergency} = props.zones;

    let normalAngle = normal.map(x => (start - end) * x);
    let alertAngle = alert.map(x => (start - end) * x);
    let warnAngle = warn.map(x => (start - end) * x);
    let alarmAngle = alarm.map(x => (start - end) * x);
    let emergencyAngle = emergency.map(x => (start - end) * x);

    const helper = new Svghelpers();
    return <svg width={props.width} height={props.height}>
        {/*<circle cx={center.x} cy={center.y} r={center.x} stroke={"orange"}/>*/}
        <g stroke={"none"}>
            {helper.getSector(center.x, center.y, radius, 10, start - normalAngle[0], start - normalAngle[1], "white")}
            {helper.getSector(center.x, center.y, radius, 10, start - alertAngle[0], start - alertAngle[1], "lightyellow")}
            {helper.getSector(center.x, center.y, radius, 10, start - warnAngle[0], start - warnAngle[1], "yellow")}
            {helper.getSector(center.x, center.y, radius, 10, start - alarmAngle[0], start - alarmAngle[1], "orange")}
            {helper.getSector(center.x, center.y, radius, 10, start - emergencyAngle[0], start - emergencyAngle[1], "red")}
        </g>


        {
            helper
                .drawDivision(center.x, center.y,
                    radius - 10,
                    10,
                    10,
                    radius * 0.15,
                    i => 2 * Math.PI / 10 * i,
                    x => "",
                    false)
        }
        <circle
            fill={"none"}
            cx={center.x}
            cy={center.y}
            r={radius}
            strokeWidth={radius * 0.01}
        />
        <circle
            fill={"none"}
            cx={center.x}
            cy={center.y}
            r={radius - 10}
            strokeWidth={radius * 0.01}
        />
        <g strokeWidth={0}>
            {helper.getSector(center.x, center.y, radius + 2, radius, start, mod(end, 360), "white")}
        </g>
    </svg>
}

export default Gauge;