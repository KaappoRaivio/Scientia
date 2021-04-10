import React from "react";

import "./Instruments.css";
import "./helpers/QuadrantInstrumentContainer.css";
import InstrumentTreeNode from "../InstrumentTreeNode";
import { useSelector } from "react-redux";

const Instruments = ({
	colors,
	// instruments,
	onInstrumentChanged,
	layoutEditingEnabled,
	signalkState,
	settings: { animation, darkMode },
}) => {
	const additionalProps = { animation, darkMode, data: signalkState };
	const instruments = useSelector(state => state.instrumentLayout);

	return (
		<div className="instrument-grid-container">
			<InstrumentTreeNode branch={instruments} additionalProps={additionalProps} colors={colors} layoutEditingEnabled={layoutEditingEnabled} />
		</div>
	);
};

export default Instruments;
