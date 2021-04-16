import React, { useEffect, useState } from "react";

import SvgHelpers, { LineTickSections } from "../helpers/svgHelpers";
// import {mod, round, range} from "mathjs";
import * as math from "mathjs";
import Needle from "../wind/Needle";

import "./gauge.css";
import NumberDisplay from "../helpers/numberdisplay/NumberDisplay";
import { PropTypes } from "prop-types";
import NoData from "../helpers/NoData";
import { valueToPercentConverters } from "../../../misc/scaleConversions";

const Gauge = ({
	width,
	height,

	animation,
	darkMode,
	colors,

	decimalPlaces,
	displayScale,
	zones,

	path,
	value,
	label,
	suffix,
	units,
}) => {
	const center = { x: 0.5, y: 0.5 };
	const radius = 0.48;
	const sectorWidth = 0.1;
	const innerCircleRadius = radius - sectorWidth;

	const start = 180;
	const end = -135;

	const percentToAngle = x => {
		return start - (start - end) * x;
	};

	if (displayScale == null) {
		return <NoData colors={colors} height={"25%"} width={"50%"} path={path} />;
	}

	const valueToPercent = valueToPercentConverters[displayScale.type || "linear"](displayScale.upper, displayScale.lower, displayScale.power);

	const divisions = getDivisions(displayScale, valueToPercent, percentToAngle);

	let limitedValue = Math.min(displayScale.upper, value);
	let needleAngle = (-percentToAngle(valueToPercent(limitedValue)) / 180) * Math.PI;

	let sectors = zones.map(zone => {
		const lowerLimit = zone.lower || displayScale.lower;
		const upperLimit = zone.upper || displayScale.upper;

		return {
			startAngle: percentToAngle(valueToPercent(lowerLimit)),
			endAngle: percentToAngle(valueToPercent(upperLimit)),
			fillColor: colors["value" + zone.state[0].toUpperCase() + zone.state.slice(1)],
		};
	});

	const darkenIfNight = () => (
		<>{darkMode ? <rect x={0} y={0} width={"100%"} height={"100%"} fill={"rgba(0, 0, 0, 0.5)"} stroke={"none"} /> : null}</>
	);

	return (
		<div className="gauge-parent" style={{ width: "100%", height: "100%" }}>
			<div className="gauge-number-display-value">
				<NumberDisplay
					width={width * 0.7}
					height={height * 0.35}
					label={label}
					suffix={suffix}
					displayScale={displayScale}
					decimalPlaces={decimalPlaces || 0}
					units={units}
					value={value}
					centerLabel={true}
					colors={colors}
					zones={zones}
					darkMode={darkMode}
					path={path}
				/>
			</div>

			<svg className="gauge-gauge">
				<Sectors
					width={width}
					height={height}
					sectors={sectors}
					center={center}
					radius={radius}
					sectorWidth={sectorWidth}
					backgroundColor={colors.background}
				/>
				<circle stroke={colors.primary} fill={"none"} cx={"50%"} cy={"50%"} r={`48.48%`} strokeWidth={"1%"} />
				<g stroke={"black"} strokeWidth={"1%"} fill={colors.background}>
					{SvgHelpers.getSector(center.x, center.y, radius, radius, math.mod(start, 360), math.mod(end, 360), colors.backgroundColor)}
				</g>
				<circle stroke={"none"} fill={colors.background} cx={"50%"} cy={"50%"} r={`${innerCircleRadius * 100}%`} />

				<g stroke={colors.secondary} fill={colors.secondary}>
					<LineTickSections center={center} radius={radius} textRadius={radius * 0.8} divisions={divisions} rotateText={false} />
				</g>

				{darkenIfNight()}
			</svg>
			<Needle angle={needleAngle} radius={radius} color={colors.accent2} animation={animation} demo={false} />
		</div>
	);
};

Gauge.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,

	animation: PropTypes.bool.isRequired,
	darkMode: PropTypes.bool.isRequired,
	colors: PropTypes.object.isRequired,

	decimalPlaces: PropTypes.number.isRequired,
	displayScale: PropTypes.shape({
		upper: PropTypes.number,
		lower: PropTypes.number,
		type: PropTypes.string,
	}),
	zones: PropTypes.array.isRequired,

	path: PropTypes.string.isRequired,
	value: PropTypes.number,
	label: PropTypes.string.isRequired,
	suffix: PropTypes.string.isRequired,
	units: PropTypes.string.isRequired,
};
class Sectors extends React.Component {
	static propTypes = {
		sectors: PropTypes.array.isRequired,
		backgroundColor: PropTypes.string.isRequired,
		center: PropTypes.shape({
			x: PropTypes.number.isRequired,
			y: PropTypes.number.isRequired,
		}),
		radius: PropTypes.number.isRequired,
		sectorWidth: PropTypes.number.isRequired,
	};

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		return (
			nextProps.sectors.length !== this.props.sectors.length ||
			nextProps.width !== this.props.width ||
			nextProps.height !== this.props.height ||
			nextProps.backgroundColor !== this.props.backgroundColor
		);
	}

	render() {
		let { sectors, backgroundColor, center, radius, sectorWidth } = this.props;

		return (
			<g stroke={"none"} fill={backgroundColor}>
				{sectors.map((item, index) => {
					return SvgHelpers.getSector(center.x, center.y, radius, sectorWidth, item.startAngle, item.endAngle, item.fillColor, index);
				})}
			</g>
		);
	}
}

const ceilToNearestMultiple = (number, multiple) => Math.ceil(number / multiple) * multiple;

export const displayScaleToLineDivisionSteps = displayScale => {
	return [displayScale.upper / 10, displayScale.upper / 20];
};
const getDivisions = (displayScale, valueToPercent, percentToangle) => {
	const steps = displayScaleToLineDivisionSteps(displayScale);

	const { upper, lower } = displayScale;

	const scales = steps.map(step => math.range(ceilToNearestMultiple(lower || 0, step), ceilToNearestMultiple(upper || 0, step), step, true)._data);
	const values = scales.map(scale => scale.map(valueToPercent));

	return values.map((value, index) => {
		return {
			numberOfLines: value.length,
			lineLength: i => {
				let derivative = value[i + 1] - value[i] || 0.1;
				let normalizer = Math.max(...value.map((_, innerIndex) => value[innerIndex + 1] - value[innerIndex] || 0.1));

				return Math.cbrt(derivative / normalizer) / 10;
			},
			textProvider: i => "",
			angleProvider: i => (percentToangle(value[i]) / 180) * Math.PI + Math.PI,
			strokeWidthMultiplier: (1 / (index + 1)) * 0.015,
		};
	});
};

export default Gauge;
