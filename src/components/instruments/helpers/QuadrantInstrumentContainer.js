import React from "react";

import "./QuadrantInstrumentContainer.css";
import AddInstrument from "./AddInstrument";
import SingleInstrumentContainer from "./SingleInstrumentContainer";

import PropTypes from "prop-types";
import RemoveInstrument from "./RemoveInstrument";

const QuadrantInstrumentContainer = ({
	index,
	onInstrumentChanged,
	onRemoveClick,
	children,
	layoutEditingEnabled,
	animation,
	darkMode,
	colors,
	data,
}) => {
	const sideLength = 300;

	return (
		<div className="single-grid-item">
			{!children.length && (
				<RemoveInstrument width={sideLength} height={sideLength} onRemoveClick={() => onRemoveClick(index)} enabled={layoutEditingEnabled} />
			)}

			<div className="quadrant-grid">
				{children.map(child => (
					<div className="quadrant-grid-item">{child}</div>
				))}
				{[...Array(layoutEditingEnabled ? 4 - children.length : 0).fill(0)].map((_, innerIndex) => (
					<SingleInstrumentContainer
						animate={animation}
						darkMode={darkMode}
						colors={colors}
						children={AddInstrument}
						data={{}}
						additionalProps={{
							onInstrumentAdded: newInstrument => {
								// instrument.instruments[4 - instrument.instruments.length + index] = newInstrument;
								console.log(newInstrument, data.concat(newInstrument));
								onInstrumentChanged(index, {
									type: "quadrant",
									instruments: data.concat(newInstrument.instruments[0]),
								});
							},
							isQuadrant: true,
						}}
						resizeDebounce={0}
						forceResize={true}
						onRemoveClick={() => {}}
						index={index}
						layoutEditingEnabled={false}
					/>
				))}
			</div>
		</div>
	);
};

QuadrantInstrumentContainer.propTypes = {
	index: PropTypes.number.isRequired,
	onInstrumentChanged: PropTypes.func.isRequired,
	children: PropTypes.arrayOf(SingleInstrumentContainer).isRequired,
	layoutEditingEnabled: PropTypes.bool.isRequired,
	animation: PropTypes.bool.isRequired,
	colors: PropTypes.object.isRequired,
	data: PropTypes.array.isRequired,
};

// ...[...Array(layoutEditingEnabled ? 4 - instrument.instruments.length : 0).fill(0)].map((_, index) =>

// )

export default QuadrantInstrumentContainer;
