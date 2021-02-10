import React, { useRef } from "react";

import "../Instruments.css";
import "./SingleInstrumentContainer.css";
import RemoveInstrument from "./RemoveInstrument";

const SingleInstrumentContainer = ({ additionalProps, children, colors, index, layoutEditingEnabled, onRemoveClick }) => {
	const probe = useRef(React.createRef());
	const sideLength = probe.current?.offsetWidth || 0;

	const childProps = {
		width: sideLength,
		height: sideLength,
		colors,
		...additionalProps,
	};

	const parentStyle = {
		height: sideLength,
		fontSize: sideLength / 10,
		color: colors.primary,
		backgroundColor: colors.background,
	};

	if (children == null) {
		return <div>No children</div>;
	}

	return (
		<div className="single-grid-item with-shadow" style={parentStyle}>
			<RemoveInstrument
				onClick={() => {
					onRemoveClick(index);
				}}
				enabled={layoutEditingEnabled}
			/>
			<div className="single-flexbox-wrapper">
				{React.createElement(children, childProps, [])}
				<div className="probe" ref={probe} />
			</div>
		</div>
	);
};

export default SingleInstrumentContainer;
