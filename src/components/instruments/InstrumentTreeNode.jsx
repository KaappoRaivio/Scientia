import React from "react";
import InstrumentContainer from "./helpers/SingleInstrumentContainer";
import Quadrants from "./layouts/Quadrants";
import AddInstrument from "./helpers/AddInstrument";
import RemoveInstrument from "./helpers/RemoveInstrument";
import { useDispatch } from "react-redux";
import { addInstrument, removeInstrument } from "../../redux/actions/applicationData";
import Single from "./layouts/Single";
import Stacked from "./layouts/Stacked";

const InstrumentTreeNode = ({ branch, id, additionalProps, colors, layoutEditingEnabled, nestingLevel = 0 }) => {
	const dispatch = useDispatch();
	const onInstrumentAdded = (id, instrument) => {
		dispatch(addInstrument(id, instrument));
	};
	const onInstrumentRemoved = id => {
		dispatch(removeInstrument(id));
	};
	const node = branch;
	if (node.type === "leaf") {
		const component = node.component;
		// console.log(component);

		const child = (
			<InstrumentContainer
				element={component.class}
				additionalProps={{ ...component.additionalProps, ...additionalProps }}
				colors={colors}
				onRemoveClick={onInstrumentRemoved}
				index={0}
				id={nestingLevel}
				key={id}
				layoutEditingEnabled={layoutEditingEnabled}
			/>
		);
		if (nestingLevel === 1) {
			return <Single>{child}</Single>;
		} else {
			return child;
		}
	} else if (node.type === "branch") {
		const nextLayer = [
			node.children.length === 0 ? (
				<RemoveInstrument
					onClick={() => {
						console.log("Removed:", id);
						onInstrumentRemoved(id);
					}}
					enabled={layoutEditingEnabled}
				/>
			) : null,
			...node.children.map((child, index) => (
				<InstrumentTreeNode
					branch={child}
					additionalProps={additionalProps}
					colors={colors}
					id={id + "." + index}
					onInstrumentRemoved={onInstrumentRemoved}
					onInstrumentAdded={onInstrumentAdded}
					layoutEditingEnabled={layoutEditingEnabled}
					key={id + "." + index}
					nestingLevel={nestingLevel + 1}
				/>
			)),
			layoutEditingEnabled && (node.children.length < 4 || id === "") ? (
				<InstrumentTreeNode
					colors={colors}
					additionalProps={additionalProps}
					branch={{
						type: "leaf",
						component: {
							class: AddInstrument,
							additionalProps: {
								onInstrumentAdded: node => onInstrumentAdded(id, node),
							},
						},
					}}
					nestingLevel={nestingLevel + 1}
				/>
			) : null,
		].filter(x => x != null);

		if (id === "") {
			return nextLayer;
		} else {
			switch (node.layout) {
				case "stacked":
					const child = <Stacked>{nextLayer}</Stacked>;
					if (nestingLevel === 1) {
						return <Single>{child}</Single>;
					} else {
						return child;
					}
				// return child;
				case "quadrants":
				default:
					return <Quadrants>{nextLayer}</Quadrants>;
			}
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
