import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getByStringPath } from "delta-processor";
import { componentTypes } from "@data-driven-forms/react-form-renderer";
import validatorTypes from "@data-driven-forms/react-form-renderer/validator-types";
import Visualiser3 from "./Visualiser3";

const useBuffer = size => {
	const [buffer, setBuffer] = useState([]);

	return [
		buffer,
		buffer[buffer.length - 1],
		newValue => {
			if (newValue != null) {
				setBuffer(oldBuffer => {
					if (oldBuffer.length >= size) {
						return oldBuffer.slice(1).concat(newValue);
					} else {
						return oldBuffer.concat(newValue);
					}
				});
			}
		},
	];
};

const makePoint = (value, displayScale, startTimestamp) => {
	if (value.value == null || value.meta == null) return null;
	const x = (new Date(value.meta.timestamp).getTime() - startTimestamp) / 1000;

	let y = value.value;
	if (displayScale?.upper != null) {
		y = Math.min(displayScale.upper, y);
	}
	if (displayScale?.lower != null) {
		y = Math.max(displayScale.lower, y);
	}

	if (x == null || y == null || startTimestamp == null) return null;
	return { x, y: y };
	// const return;
};

const VisualiserContainer = ({ path, xRange, data, width, height, invertYAxis }) => {
	const node = getByStringPath(path, data.vessels.self, true);
	const [startTimestamp, setStartTimestamp] = useState(null);
	const [points, lastValue, addPoint] = useBuffer(xRange || 100);

	let timestamp = node?.meta?.timestamp;
	useEffect(() => {
		if (startTimestamp == null && timestamp) {
			setStartTimestamp(new Date(timestamp).getTime());
			console.log("Setting timestamp");
		}
	}, [startTimestamp, timestamp]);

	const newPoint = makePoint(node, node?.meta?.displayScale, startTimestamp);
	if (newPoint != null && newPoint?.x !== lastValue?.x) {
		addPoint(newPoint);
	}

	if (points[0] == null || lastValue == null) return <div />;

	return <Visualiser3 data={points} meta={node.meta} displayOptions={{ invertYAxis }} width={width} height={height} />;
};

VisualiserContainer.propTypes = {};

VisualiserContainer.schema = [
	{
		component: componentTypes.TEXT_FIELD,
		name: "path",
		placeholder: "Path",
		validate: [
			{
				type: validatorTypes.MIN_LENGTH,
				threshold: 1,
			},
		],
	},
	{ component: componentTypes.SWITCH, name: "invertYAxis", placeholder: "Inverted", label: "Invert y axis" },
];

export default VisualiserContainer;
