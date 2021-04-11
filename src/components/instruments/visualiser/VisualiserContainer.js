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

const makePoint = (value, startTimestamp) => {
	if (value.value == null || value.meta == null) return null;
	const x = (new Date(value.meta.timestamp).getTime() - startTimestamp) / 1000;
	const y = value.value;
	if (x == null || y == null || startTimestamp == null) return null;
	return { x, y: y };
	// const return;
};

const VisualiserContainer = ({ path, xRange, data, width, height }) => {
	const value = getByStringPath(path, data.vessels.self, true);
	const [startTimestamp, setStartTimestamp] = useState(null);
	const [points, lastValue, addPoint] = useBuffer(xRange || 100);

	let timestamp = value?.meta?.timestamp;
	useEffect(() => {
		if (startTimestamp == null && timestamp) {
			setStartTimestamp(new Date(timestamp).getTime());
			console.log("Setting timestamp");
		}
	}, [startTimestamp, timestamp]);

	const newPoint = makePoint(value, startTimestamp);
	if (newPoint != null && newPoint?.x !== lastValue?.x) {
		addPoint(newPoint);
	}

	if (points[0] == null || lastValue == null) return <div></div>;

	return (
		<Visualiser3
			// points={points.map(item => ({ y: item.y, x: (item.x - points[0].x) / (lastValue.x - points[0].x) }))}
			points={points}
			width={width}
			height={height}
			scale={"logarithmic"}
		/>
	);
	// return <Visualiser3 points={points.map(item => points[0])} width={width} height={height} />;
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
];

export default VisualiserContainer;
