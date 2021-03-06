import { ADD_INSTRUMENT, REMOVE_INSTRUMENT } from "../actions/actions";
import _ from "lodash";
import { UPDATE_INSTRUMENT_LAYOUT } from "../actions/applicationData";

const initialState = { type: "branch", children: [] };
const instrumentLayoutReducer = (instrumentLayoutState = initialState, action) => {
	switch (action.type) {
		case UPDATE_INSTRUMENT_LAYOUT:
			return action.layout;
		default:
			return instrumentLayoutState;
	}
};

export const mergeNewInstrumentById = (instruments, id, node) => {
	const indices = id
		.split(".")
		.slice(1)
		.map(a => parseInt(a));

	const clonedInstruments = _.cloneDeep(instruments);
	let nodeToAdd = clonedInstruments;
	for (const childIndex of indices) {
		console.log(nodeToAdd);
		if (nodeToAdd.type === "branch") {
			nodeToAdd = nodeToAdd.children[childIndex];
		} else {
			throw Error(`Something happened, got indices ${indices}, but encountered leaf node before the end of them.`);
		}
	}

	nodeToAdd.children.push(node);
	return clonedInstruments;
};

export const removeInstrumentById = (instruments, id) => {
	const indices = id
		.split(".")
		.slice(1)
		.map(a => parseInt(a));

	const clonedInstruments = _.cloneDeep(instruments);

	let nodeToRemove = clonedInstruments;
	for (let i = 0; i < indices.length; i++) {
		const childIndex = indices[i];
		console.log(childIndex);
		if (nodeToRemove.type === "branch") {
			if (i === indices.length - 1) {
				nodeToRemove.children = nodeToRemove.children.slice(0, childIndex).concat(nodeToRemove.children.slice(childIndex + 1));
			} else {
				nodeToRemove = nodeToRemove.children[childIndex];
			}
		}
	}

	return clonedInstruments;
};

export default instrumentLayoutReducer;
