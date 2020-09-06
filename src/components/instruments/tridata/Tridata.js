import NumberDisplay from "../helpers/numberdisplay/NumberDisplay";
import React from "react";

const Tridata = props => {
	// console.log(props.values)
	const commonUpperBound = props.values
		.map(value => value.meta.displayScale?.upper)
		?.reduce((a, b) => {
			if (b == null || isNaN(b)) {
				return null;
			}
			return a > b ? a : b;
		});

	const commonLowerBound = props.values
		.map(value => value.meta.displayScale?.lower)
		?.reduce((a, b) => {
			if (b == null || isNaN(b)) {
				return null;
			}
			return a < b ? a : b;
		});

	const commonDisplayScale = {
		lower: commonLowerBound,
		upper: commonUpperBound,
	};
	const colors = props.colors;

	const parentStyle = {
		width: props.width,
		height: props.height,
		color: colors.primary,
		backgroundColor: colors.background,
		position: "relative",
	};

	return (
		<div style={parentStyle}>
			{props.values.map((value, index) => {
				return (
					<NumberDisplay
						key={index}
						value={value.value}
						suffix={""}
						units={value.meta.units}
						label={value.meta.displayName}
						isNumber={value.meta.isNumber}
						decimalPlaces={value.meta.decimalPlaces}
						displayScale={commonDisplayScale}
						zones={value.meta.zones}
						fontSize={props.width / 4}
						width={props.width}
						height={props.height / props.values.length}
						colors={props.colors}
						darkMode={props.darkMode}
					/>
				);
			})}
		</div>
	);
};

export default Tridata;
