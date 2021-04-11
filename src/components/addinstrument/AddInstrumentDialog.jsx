import React from "react";
import PropTypes from "prop-types";
import MyModal from "../modal/MyModal";
import { useDispatch, useSelector } from "react-redux";
import AddInstrument from "../instruments/helpers/AddInstrument";
import { addInstrument } from "../../redux/actions/actions";

const AddInstrumentDialog = props => {
	const dispatch = useDispatch();
	const colors = useSelector(state => state.settings.appearance.colors);

	return (
		<MyModal isOpen={useSelector(state => state.appState.addInstrumentDialogOpen)} style={{ height: "80%" }}>
			<AddInstrument onInstrumentAdded={(id, node) => dispatch(addInstrument(id, node))} width={1000} height={1000} colors={colors} />
		</MyModal>
	);
};

AddInstrumentDialog.propTypes = {};

export default AddInstrumentDialog;
