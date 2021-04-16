import React from "react";

import "./Compass.css";
import NumberDisplay from "../helpers/numberdisplay/NumberDisplay";
import { LineTickSections } from "../helpers/svgHelpers";

const Compass = props => {
	const center = getCenter(props);
	const radius = getRadius(props);
	const colors = props.colors;
	const heading = props.heading?.value;

	const parentStyle = {
		width: props.width + "px",
		height: props.height + "px",
		color: colors.primary,
		backgroundColor: colors.background,
	};

	let compassRotationStyle;
	if (props.animation) {
		compassRotationStyle = { transform: `rotate(${-heading}deg)` };
	} else {
		compassRotationStyle = {
			transform: `rotate(${-heading}deg)`,
			transition: "none",
		};
	}

	return (
		<div className="compass" style={parentStyle}>
			<NumberDisplay
				className="number"
				value={heading}
				suffix="°"
				units="cog"
				width={props.width}
				height={props.height / 3}
				upperBound={360}
				decimalPlaces={1}
				label="Heading"
				colors={colors}
				darkMode={props.darkMode}
				displayScale={{ lower: 0, upper: 360, type: "linear" }}
			/>

			<svg className="compassRose" width="100%" height="100%" strokeWidth={"1%"} style={compassRotationStyle}>
				<circle cx="50%" cy="50%" r="49.5%" fill={colors.background} stroke={colors.primary} strokeWidth={"1%"} />

				<g fill={colors.primary} stroke={colors.primary} strokeWidth={"1.5%"}>
					<LineTickSections center={center} radius={radius} divisions={props.divisions} rotateText={true} />
				</g>
			</svg>
		</div>
	);
};

const getRadius = props => {
	// return Math.max(props.width / 2 - 2, 0);
	return 0.5;
};

const getCenter = props => {
	// return { x: Math.floor(props.width / 2), y: Math.floor(props.height / 2) };
	return { x: 0.5, y: 0.5 };
};

export default Compass;
