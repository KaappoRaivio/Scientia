import React, { useState } from "react";
import "./AddInstrument.css";

import SettingsForm from "../../settings/SettingsForm";

import ReactDropdown from "react-dropdown";
import { stringToClass } from "../../../models/LayoutModel";

const schema = {
	buttonsAtBottom: true,
	dontShowApply: true,
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
			label: "Graph",
			value: "VisualiserContainer",
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
		value: {
			component: "WindContainer",
		},
	},
	TridataContainer: {
		value: {
			component: "TridataContainer",
		},
	},
	GaugeContainer: {
		value: {
			component: "GaugeContainer",
		},
	},
	CompassContainer: {
		value: {
			component: "CompassContainer",
		},
	},
	VisualiserContainer: {
		value: {
			component: "VisualiserContainer",
		},
	},
	quadrant: {
		value: {
			components: [],
			type: "quadrant",
		},
	},
};

const AddInstrument = ({ onInstrumentAdded, width, height, colors, darkMode, isQuadrant }) => {
	const lineWidth = 3;

	// const svgSize = { x: width / 2.5, y: height / 2.5 };
	// const center = { x: svgSize.x / 2, y: svgSize.y / 2 };
	const svgSize = { x: 100, y: 100 };
	const center = { x: 50, y: 50 };

	const [plusPressed, setPlusPressed] = useState(false);
	const [selectedItem, setSelectedItem] = useState(spinnerSchema.options[0]);

	const onConfirm = options => {
		const item = stringToObject[selectedItem.value].value;
		if (item.type === "quadrant") {
			console.log("quadrant");
			onInstrumentAdded({
				type: "branch",
				children: [],
			});
		} else {
			onInstrumentAdded({
				type: "leaf",
				component: {
					class: stringToClass(item.component),
					additionalProps: options,
				},
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
				{/*<svg width={svgSize.x} height={svgSize.y} strokeWidth={lineWidth} stroke={colors.primary}>*/}
				{/*	<line x1={center.x} y1={lineWidth / 2} x2={center.x} y2={svgSize.y - lineWidth / 2} strokeLinecap={"round"} />*/}
				{/*	<line x1={lineWidth / 2} y1={center.y} x2={svgSize.x - lineWidth / 2} y2={center.x} strokeLinecap={"round"} />*/}
				{/*	<rect width={svgSize.x} height={svgSize.y} fill={darkMode ? "none" : "rgba(255, 255, 255, 0.75)"} stroke={"none"} />*/}
				{/*</svg>*/}
				<svg width="100%" height="100%" style={{ width: "40%", height: "40%" }} strokeWidth={`${lineWidth}%`} stroke={colors.primary}>
					<line
						x1={`${center.x}%`}
						y1={`${lineWidth / 2}%`}
						x2={`${center.x}%`}
						y2={`${svgSize.y - lineWidth / 2}%`}
						strokeLinecap={"round"}
					/>
					<line
						x1={`${lineWidth / 2}%`}
						y1={`${center.y}%`}
						x2={`${svgSize.x - lineWidth / 2}%`}
						y2={`${center.x}%`}
						strokeLinecap={"round"}
					/>
					<rect width={`${svgSize.x}%`} height={`${svgSize.y}%`} fill={darkMode ? "none" : "rgba(255, 255, 255, 0.75)"} stroke={"none"} />
				</svg>
			</button>
		);
	} else {
		const localSchema = {
			...schema,
			isQuadrant,
			fields: stringToClass(stringToObject[selectedItem.value].value.component)?.schema || [],
		};
		return (
			<div
				style={{
					padding: "3%",
					fontSize: "50%",
					overflowY: "auto",
					height: "100%",
				}}>
				<ReactDropdown
					style={{ position: "relative", fontSize: "200%" }}
					value={selectedItem}
					onChange={onSpinnerChange}
					options={spinnerSchema.options}
					placeholder={spinnerSchema.label}
				/>
				<SettingsForm
					style={{ fontSize: "50%", height: "90%" }}
					schema={localSchema}
					onSubmit={onConfirm}
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
