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
				layoutEditingEnabled={layoutEditingEnabled}
			/>
			{/*{instruments.map((node, index) => {*/}
			{/*	if (node.type === "leaf") {*/}
			{/*		const component = node.component;*/}

			{/*		return (*/}
			{/*			<SingleInstrumentContainer*/}
			{/*				element={component.class}*/}
			{/*				additionalProps={{ ...component.additionalProps, ...additionalProps }}*/}
			{/*				colors={colors}*/}
			{/*				onRemoveClick={onInstrumentRemoved}*/}
			{/*				index={index}*/}
			{/*				layoutEditingEnabled={layoutEditingEnabled}*/}
			{/*			/>*/}
			{/*		);*/}
			{/*	} else {*/}
			{/*		return <div>Unknown instrument type {node.type}</div>;*/}
			{/*	}*/}
			{/*})}*/}

			{layoutEditingEnabled && (
				<SingleInstrumentContainer
					children={AddInstrument}
					data={signalkState}
					additionalProps={{ ...additionalProps, onInstrumentAdded }}
					colors={colors}
					layoutEditingEnabled={false}
				/>
			)}
		</div>
	);
};

export default Instruments;
