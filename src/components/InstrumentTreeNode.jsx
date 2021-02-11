import React from "react";
import SingleInstrumentContainer from "./instruments/helpers/SingleInstrumentContainer";
import Quadrants from "./instruments/Quadrants";

const InstrumentTreeNode = ({ branch, id, additionalProps, colors, onInstrumentRemoved, layoutEditingEnabled }) => {
	const node = branch;
	if (node.type === "leaf") {
		const component = node.component;

		return (
			<SingleInstrumentContainer
				element={component.class}
				additionalProps={{ ...component.additionalProps, ...additionalProps }}
				colors={colors}
				onRemoveClick={onInstrumentRemoved}
				index={0}
				id={id}
				layoutEditingEnabled={layoutEditingEnabled}
			/>
		);
	} else if (node.type === "branch") {
		const nextLayer = (
			<>
				{node.children.map((child, index) => (
					<InstrumentTreeNode
						branch={child}
						additionalProps={additionalProps}
						colors={colors}
						id={id + "." + index}
						onInstrumentRemoved={onInstrumentRemoved}
						layoutEditingEnabled={layoutEditingEnabled}
					/>
				))}
			</>
		);
		if (id === "") {
			return nextLayer;
		} else {
			return <Quadrants>{nextLayer}</Quadrants>;
		}
	} else {
		return <div>Unknown instrument type {node.type}</div>;
	}
};
InstrumentTreeNode.defaultProps = {
	id: "",
};

InstrumentTreeNode.propTypes = {};

export default InstrumentTreeNode;
