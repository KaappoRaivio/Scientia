import React from "react";

import Svghelpers, {LineDivisions} from "../../misc/svghelpers";
// import {mod, round, range} from "mathjs";
import * as math from "mathjs";
import Needle from "../wind/Needle";

import "./gauge.css"
import NumberDisplay from "../../numberdisplay/NumberDisplay";
import {PropTypes} from "prop-types";
import {displayScaleToLineDivisionSteps} from "../DataStructures";
import NoData from "../../noninstruments/NoData";

const valueToPercentConverters = {
    "linear":      (upper, lower) => x => (x - lower) / (upper - lower),
    "logarithmic": (upper, lower) => x => (Math.log10(x) - Math.log10(lower)) / (Math.log10(upper) - Math.log10(lower)),
    "squareroot":  (upper, lower) => x => (Math.sqrt(x) - Math.sqrt(lower)) / (Math.sqrt(upper) - Math.sqrt(lower)),
    "power": (upper, lower, power) => x => (x ** power - lower ** power) / (upper ** power - lower ** power)
}

const Gauge = ({
                   width,
                   height,

                   animate,
                   darkMode,
                   colors,

                   decimalPlaces,
                   displayScale,
                   zones,

                   value,
                   label,
                   suffix,
                   units,
}) => {


    const center = {x: width / 2, y: height / 2};
    const radius = width / 2.1;
    const radiusPercent = radius / (width / 2) * 100 / 2;

    let start = 135;
    let end = -135;

    const percentToAngle = x => {
        return start - (start - end) * x;
    };

    if (displayScale == null) {
        return <NoData colors={colors} height={height} width={width} />
    }

    const valueToPercent = valueToPercentConverters[displayScale.type || "linear"](displayScale.upper, displayScale.lower, displayScale.power);

    const divisions = getDivisions(displayScale, valueToPercent, percentToAngle)

    let limitedValue = Math.min(displayScale.upper, value);
    let needleAngle = -percentToAngle(valueToPercent(limitedValue)) / 180 * Math.PI;

    let sectors = zones.map(zone => {
        const lowerLimit = zone.lower || displayScale.lower;
        const upperLimit = zone.upper || displayScale.upper;

        return {
            startAngle: percentToAngle(valueToPercent(lowerLimit)),
            endAngle: percentToAngle(valueToPercent(upperLimit)),
            fillColor: colors["value" + zone.state[0].toUpperCase() + zone.state.slice(1)]
        };
    })

    let sectorWidth = radius * 0.2;

    const darkenIfNight = () => <>
        {darkMode
            ? <rect x={0} y={0} width={width} height={height} fill={"rgba(0, 0, 0, 0.5)"}
                    stroke={"none"}/>
            : null
        }
    </>;

    // console.log("asdasd", units);

    const lineWidth = 0.02;
    return <div className="gauge-parent" style={{width: width, height: height}}>
        <div className="gauge-number-display-value">
            <NumberDisplay width={width * 0.7} height={height * 0.35}
                           label={label}
                           suffix={suffix}
                           displayScale={displayScale} decimalPlaces={decimalPlaces || 0}
                           units={units}
                           value={value}
                           centerLabel={true}
                           colors={colors}
                           zones={zones}
                           darkMode={darkMode}
            />
        </div>

        <svg className="gauge-gauge" width={width} height={height} xmlns="http://www.w3.org/2000/svg">
            <g className="gauge-sectors">
                <Sectors width={width} height={height} sectors={sectors} center={center} radius={radius}
                         sectorWidth={sectorWidth} backgroundColor={colors.background}/>
            </g>
            <circle stroke={colors.secondary} fill={"none"} cx={center.x} cy={center.y} r={radius + radius * lineWidth / 2} strokeWidth={radius * lineWidth}/>
            <g stroke={"black"} strokeWidth={radius * lineWidth / 2} fill={colors.background}>
                {Svghelpers.getSector(center.x, center.y, radius, radius, math.mod(start, 360),  math.mod(end, 360), colors.backgroundColor)}
            </g>
            <circle stroke={"none"} fill={colors.background} cx={center.x} cy={center.y} r={radius - sectorWidth}/>



            <g stroke={colors.secondary} fill={colors.secondary} strokeWidth={radius * lineWidth}>
                <LineDivisions center={center} radius={radius} textRadius={radius * 0.8} divisions={divisions} rotateText={false}/>
            </g>

            {darkenIfNight()}
        </svg>
        <Needle angle={needleAngle} radius={radiusPercent} color={colors.accent2} animate={animate} demo={false}/>
    </div>
}

Gauge.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,

    animate: PropTypes.bool.isRequired,
    darkMode: PropTypes.bool.isRequired,
    colors: PropTypes.object.isRequired,

    decimalPlaces: PropTypes.number.isRequired,
    displayScale: PropTypes.shape({
        upper: PropTypes.number,
        lower: PropTypes.number,
        type: PropTypes.string
    }),
    zones: PropTypes.array.isRequired,

    value: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    suffix: PropTypes.string.isRequired,
    units: PropTypes.string.isRequired,
}
class Sectors extends React.Component {
    static propTypes = {
        sectors: PropTypes.array.isRequired,
        backgroundColor: PropTypes.string.isRequired,
        center: PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired
        }),
        radius: PropTypes.number.isRequired,
        sectorWidth: PropTypes.number.isRequired,
    }

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

const ceilToNearestMultiple = (number, multiple) => Math.ceil(number / multiple) * multiple

const getDivisions = (displayScale, valueToPercent, percentToangle) => {
    const steps = displayScaleToLineDivisionSteps(displayScale);

    const { upper, lower } = displayScale;

    const scales = steps.map(step => math.range(ceilToNearestMultiple(lower || 0, step), ceilToNearestMultiple(upper || 0, step), step, true)._data);
    const values = scales.map(scale => scale.map(valueToPercent));

    return values.map((value, index) => {
        return {
            numberOfLines: value.length,
            lineLength: i => {
                let derivative = value[i + 1] - value[i] || 0.1;
                let normalizer = Math.max(...value.map((_, innerIndex) => value[innerIndex + 1] - value[innerIndex] || 0.1))

                return Math.cbrt(derivative / normalizer) / 5;
            },
            textProvider: i => "",
            angleProvider: i => percentToangle(value[i]) / 180 * Math.PI + Math.PI,
            strokeWidthMultiplier: 1 / (index + 1) * 0.01
        };
    });
}


export default Gauge;