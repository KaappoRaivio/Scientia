import React from "react";

import "./SingleInstrumentContainer.css";

const RemoveInstrument = ({ height, width, onRemoveClick, enabled }) => {
	const svgSize = { width: width / 12, height: height / 12 };
	const lineLength = 0.95;

	// console.log(svgSize)

	// return <div className="remove-instrument">Remove</div>
	return (
		<svg className={`remove-instrument ${enabled ? "" : "disabled"}`} width={svgSize.width} height={svgSize.height} onClick={onRemoveClick}>
			<g strokeWidth={1.5} stroke={"gray"} strokeLinecap="round">
				<line
					x1={svgSize.width * (1 - lineLength)}
					x2={svgSize.width * lineLength}
					y1={svgSize.height * (1 - lineLength)}
					y2={svgSize.height * lineLength}
				/>
				<line
					x2={svgSize.width * (1 - lineLength)}
					x1={svgSize.width * lineLength}
					y1={svgSize.height * (1 - lineLength)}
					y2={svgSize.height * lineLength}
				/>
			</g>
		</svg>
	);
};

export default RemoveInstrument;
