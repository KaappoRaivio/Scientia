import React, { useState } from "react";
import MyModal from "../modal/MyModal";
import { useDispatch, useSelector } from "react-redux";
import ReactDropdown from "react-dropdown";
import SettingsForm from "../settings/SettingsForm";
import spinnerSchema from "../../assets/addinstrument/spinneschema.json";
import { stringToClass } from "../../models/LayoutModel";
import stringToObject from "../../assets/addinstrument/responseschema.json";

const AddInstrumentDialog = props => {
	const dispatch = useDispatch();
	const colors = useSelector(state => state.settings.appearance.colors);

	// const localSchema = {
	// 	...schema,
	// 	isQuadrant,
	// 	fields: stringToClass(stringToObject[selectedItem.value].value.component)?.schema || [],
	// };

	const [selectedItem, setSelectedItem] = useState(spinnerSchema.options[0]);
	const onSpinnerChange = selectedItem => {
		console.log(selectedItem);
		setSelectedItem(selectedItem);
	};

	// const localSchema = {
	// 	...schema,
	// 	isQuadrant,
	// 	fields: stringToClass(stringToObject[selectedItem.value].value.component)?.schema || [],
	// };
	//
	// return (
	// 	<MyModal isOpen={useSelector(state => state.appState.addInstrumentDialogOpen)} style={{ height: "80%" }}>
	// 		{/*<AddInstrument onInstrumentAdded={(id, node) => dispatch(addInstrument(id, node))} width={1000} height={1000} colors={colors} />*/}
	// 		<div
	// 			style={{
	// 				padding: "3%",
	// 				fontSize: "50%",
	// 				overflowY: "auto",
	// 				height: "100%",
	// 			}}>
	// 			<ReactDropdown
	// 				style={{ position: "relative", fontSize: "200%" }}
	// 				value={selectedItem}
	// 				onChange={onSpinnerChange}
	// 				options={spinnerSchema.options}
	// 				placeholder={spinnerSchema.label}
	// 			/>
	// 			<SettingsForm
	// 				style={{ fontSize: "50%", height: "90%" }}
	// 				schema={localSchema}
	// 				onSubmit={onConfirm}
	// 				requestClosing={() => {
	// 					setPlusPressed(false);
	// 					setSelectedItem(spinnerSchema.options[0]);
	// 				}}
	// 			/>
	// 		</div>
	// 		{/*);*/}
	// 	</MyModal>
	// );
	return null;
};

AddInstrumentDialog.propTypes = {};

export default AddInstrumentDialog;
