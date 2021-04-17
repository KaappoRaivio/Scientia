import React from "react";
import SingleInstrumentContainer from "./helpers/SingleInstrumentContainer";
import Quadrants from "./Quadrants";
import AddInstrument from "./helpers/AddInstrument";
import RemoveInstrument from "./helpers/RemoveInstrument";
import { useDispatch } from "react-redux";
import { addInstrument, removeInstrument } from "../../redux/actions/applicationData";

const InstrumentTreeNode = ({ branch, id, additionalProps, colors, layoutEditingEnabled }) => {
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

		return (
			<SingleInstrumentContainer
				element={component.class}
				additionalProps={{ ...component.additionalProps, ...additionalProps }}
				colors={colors}
				onRemoveClick={onInstrumentRemoved}
				index={0}
				id={id}
				key={id}
				layoutEditingEnabled={layoutEditingEnabled}
			/>
		);
	} else if (node.type === "branch") {
		const nextLayer = (
			<>
				{node.children.length === 0 ? (
					<RemoveInstrument
						onClick={() => {
							console.log("Removed:", id);
							onInstrumentRemoved(id);
						}}
						enabled={layoutEditingEnabled}
					/>
				) : null}
				{node.children.map((child, index) => (
					<InstrumentTreeNode
						branch={child}
						additionalProps={additionalProps}
						colors={colors}
						id={id + "." + index}
						onInstrumentRemoved={onInstrumentRemoved}
						onInstrumentAdded={onInstrumentAdded}
						layoutEditingEnabled={layoutEditingEnabled}
						key={id + "." + index}
					/>
				))}
				{layoutEditingEnabled && (node.children.length < 4 || id === ".") ? (
					<>
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
						/>
					</>
				) : null}
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
