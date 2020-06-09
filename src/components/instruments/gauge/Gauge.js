import React, {PureComponent} from "react";

import { pure } from "recompose";

import Svghelpers, {LineDivision, LineDivisions} from "../../misc/svghelpers";
import {mod} from "mathjs";
import Needle from "../wind/Needle";

import "./gauge.css"
import NumberDisplayValue from "../../numberdisplay/NumberDisplayValue";
import * as PropTypes from "prop-types";
import NumberDisplay from "../../numberdisplay/numberdisplay";

const Gauge = (props) => {
    const center = {x: props.width / 2, y: props.height / 2};
    const radius = props.width / 2.1;
    const radiusPercent = radius / (props.width / 2) * 100 / 2;

    const valueToPercent = x => (x - props.displayScale.lower) - (props.displayScale.upper - x)
    const percentToAngle = x => start -  (start - end) * x;

    let start = 135;
    let end = -135;

    let limitedValue = Math.min(props.displayScale.upper, props.value);
    // let needleAngle = ((start - end) / 180 * Math.PI) / props.displayScale.upper * limitedValue - start / 180 * Math.PI;
    let needleAngle = percentToAngle(valueToPercent(limitedValue));

    const colors = props.colors;

    let { normal, alert, warn, alarm, emergency} = props.zones;


    let normalAngle = normal.map(valueToPercent).map(percentToAngle);
    let alertAngle = alert.map(valueToPercent).map(percentToAngle);
    let warnAngle = warn.map(valueToPercent).map(percentToAngle);
    let alarmAngle = alarm.map(valueToPercent).map(percentToAngle);
    let emergencyAngle = emergency.map(valueToPercent).map(percentToAngle);

    let sectors = [
        {startAngle: normalAngle[0], endAngle: normalAngle[1], fillColor: "lightgreen"},
        {startAngle: alertAngle[0], endAngle: alertAngle[1], fillColor: "yellow"},
        {startAngle: warnAngle[0], endAngle: warnAngle[1], fillColor: "orange"},
        {startAngle: alarmAngle[0], endAngle: alarmAngle[1], fillColor: "red"},
        {startAngle: emergencyAngle[0], endAngle: emergencyAngle[1], fillColor: "purple"},
    ]

    let sectorWidth = radius * 0.2;
    const divisions = props.divisions;


    function darkenIfNight() {
        return <>
            {props.darkMode
                ? <rect x={0} y={0} width={props.width} height={props.height} fill={"rgba(0, 0, 0, 0.5)"}
                        stroke={"none"}/>
                : null
            }
        </>;
    }

    return <div className="gauge-parent" style={{width: props.width, height: props.height}}>
        <div className="gauge-number-display-value">
            <NumberDisplay width={props.width * 0.7} height={props.height * 0.3}
                           legend={props.label} suffix={props.suffix} upperBound={props.displayScale.upper} decimalPlaces={props.decimalPlaces || 0}
                           unit={props.unit}
                           value={props.value}
                           centerLabel={true}
            />
        </div>

        <svg className="gauge-gauge" width={props.width} height={props.height} xmlns="http://www.w3.org/2000/svg">
            <g className="gauge-sectors">
                <Sectors width={props.width} height={props.height} sectors={sectors} center={center} radius={radius}
                         sectorWidth={sectorWidth} backgroundColor={colors.background}/>
            </g>
            <circle stroke={"black"} fill={"none"} cx={center.x} cy={center.y} r={radius} strokeWidth={radius * 0.01}/>

            <g stroke={"black"} strokeWidth={radius * 0.01}>
                <LineDivisions center={center} radius={radius} divisions={divisions}/>
            </g>
            <Sectors width={props.width} height={props.height}
                     sectors={[{startAngle: start, endAngle: mod(end, 360), fillColor: colors.background}]}
                     center={center} radius={radius + 2} sectorWidth={radius} backgroundColor={colors.background}
            />
            {darkenIfNight()}
        </svg>
        <Needle angle={needleAngle} radius={radiusPercent} color={colors.accent1} animate={props.animate} demo={false}/>
    </div>
}


class Sectors extends React.Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.sectors.length !== this.props.sectors.length
            || nextProps.width !== this.props.width
            || nextProps.height !== this.props.height
            || nextProps.backgroundColor !== this.props.backgroundColor;
    }

    render() {
        let {sectors, backgroundColor, center, radius, sectorWidth} = this.props;

        return <g stroke={"none"} fill={backgroundColor}>
            {sectors.map((item, index) => {
                return Svghelpers.getSector(center.x, center.y, radius, sectorWidth, item.startAngle, item.endAngle, item.fillColor, index)
            })}
        </g>;
    }
}



export default Gauge;