import React from "react";

import "./Instruments.css";
import "./helpers/QuadrantInstrumentContainer.css";

import SingleInstrumentContainer from "./helpers/SingleInstrumentContainer";
import AddInstrument from "./helpers/AddInstrument";
import InstrumentTreeNode from "../InstrumentTreeNode";

const Instruments = ({
	colors,
	instruments,
	onInstrumentAdded,
	onInstrumentRemoved,
	onInstrumentChanged,
	layoutEditingEnabled,
	signalkState,
	settings: { animation, darkMode },
}) => {
	const additionalProps = { animation, darkMode, data: signalkState };
	return (
		<div className="instrument-grid-container">
			<InstrumentTreeNode
				branch={instruments}
				additionalProps={additionalProps}
				colors={colors}
				onInstrumentRemoved={onInstrumentRemoved}
				onInstrumentAdded={onInstrumentAdded}
				layoutEditingEnabled={layoutEditingEnabled}
			/>
		</div>
	);
};

export default Instruments;
