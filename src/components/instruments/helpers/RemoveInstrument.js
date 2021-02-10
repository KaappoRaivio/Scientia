import React from "react";

import "./SingleInstrumentContainer.css";

const RemoveInstrument = ({ onClick, enabled }) => {
	const lineLength = 0.95;

	return (
		<svg className={`remove-instrument ${enabled ? "" : "disabled"}`} width={"8%"} height={"8%"} onClick={onClick}>
			<g strokeWidth={1.5} stroke={"gray"} strokeLinecap="round">
				<line x1={`${(1 - lineLength) * 100}%`} x2={`${lineLength * 100}%`} y1={`${(1 - lineLength) * 100}%`} y2={`${lineLength * 100}%`} />
				<line x2={`${(1 - lineLength) * 100}%`} x1={`${lineLength * 100}%`} y1={`${(1 - lineLength) * 100}%`} y2={`${lineLength * 100}%`} />
			</g>
		</svg>
	);
};

export default RemoveInstrument;
