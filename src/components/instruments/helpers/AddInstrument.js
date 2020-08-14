import React, { useState } from "react";
import "./AddInstrument.css";

import SettingsForm from "../../settings/SettingsForm";

import ReactDropdown from "react-dropdown";
import { stringToClass } from "../Instruments";

const schema = {
	buttonsAtBottom: true,
	dontShowApply: true,
};

const mergeFields = fields => {
	if (fields == null || fields === []) return null;
	return { ...schema, fields };
};

const spinnerSchema = {
	component: "select",
	name: "instrument",
	label: "Select instrument",
	options: [
		{
			label: "Wind",
			// value: {
			// 	component: "WindContainer",
			// },
			value: "WindContainer",
		},
		{
			label: "Tridata",
			// value: {
			// 	component: "TridataContainer",
			// },
			value: "TridataContainer",
		},
		{
			label: "Gauge",
			// value: {
			// 	component: "GaugeContainer",
			// },
			value: "GaugeContainer",
		},
		{
			label: "Compass",
			// value: {
			// 	component: "CompassContainer",
			// },
			value: "CompassContainer",
		},
		{
			label: "Quadrant...",
			// value: {
			// 	components: [],
			// 	type: "quadrant",
			// },
			value: "quadrant",
		},
	].sort((a, b) => a.label.localeCompare(b.label)),
};

const stringToObject = {
	WindContainer: {
		component: "WindContainer",
	},
	TridataContainer: {
		component: "TridataContainer",
	},
	GaugeContainer: {
		component: "GaugeContainer",
	},
	CompassContainer: {
		component: "CompassContainer",
	},
	quadrant: {
		label: "Quadrant...",
		value: {
			components: [],
			type: "quadrant",
		},
	},
};

const AddInstrument = ({ onInstrumentAdded, width, height, colors, darkMode }) => {
	const lineWidth = 3;

	const svgSize = { x: width / 2.5, y: height / 2.5 };
	const center = { x: svgSize.x / 2, y: svgSize.y / 2 };

	const [plusPressed, setPlusPressed] = useState(false);
	const [selectedItem, setSelectedItem] = useState(spinnerSchema.options[0]);

	const onConfirm = options => {
		if (selectedItem.value.type === "quadrant") {
			console.log("quadrant");
			onInstrumentAdded({
				type: "quadrant",
				instruments: selectedItem.value.components,
			});
		} else {
			onInstrumentAdded({
				type: "single",
				instruments: [
					{
						component: selectedItem.value.component,
						additionalProps: options,
					},
				],
			});
		}
	};

	const onSpinnerChange = selectedItem => {
		console.log(selectedItem);
		setSelectedItem(selectedItem);
	};

	if (!plusPressed) {
		return (
			<button onClick={() => setPlusPressed(true)} className="addinstrument-parent" style={{ backgroundColor: colors.background }}>
				<svg width={svgSize.x} height={svgSize.y} strokeWidth={lineWidth} stroke={colors.primary}>
					<line x1={center.x} y1={lineWidth / 2} x2={center.x} y2={svgSize.y - lineWidth / 2} strokeLinecap={"round"} />
					<line x1={lineWidth / 2} y1={center.y} x2={svgSize.x - lineWidth / 2} y2={center.x} strokeLinecap={"round"} />
					<rect width={svgSize.x} height={svgSize.y} fill={darkMode ? "none" : "rgba(255, 255, 255, 0.75)"} stroke={"none"} />
				</svg>
			</button>
		);
	} else {
		return (
			<div
				style={{
					padding: "3%",
					fontSize: "50%",
					height: "80%",
					overflowY: "auto",
				}}>
				<ReactDropdown
					style={{ position: "absolute" }}
					value={selectedItem}
					onChange={onSpinnerChange}
					options={spinnerSchema.options}
					placeholder={spinnerSchema.label}
				/>
				<SettingsForm
					schema={mergeFields(stringToClass(stringToObject[selectedItem.value].component)?.schema || [])}
					onSettingsUpdate={onConfirm}
					requestClosing={() => {
						setPlusPressed(false);
						setSelectedItem(spinnerSchema.options[0]);
					}}
				/>
			</div>
		);
	}
};

export default AddInstrument;
