import React from "react";
import Modal from "react-modal";

import "./SettingsDialog.css";
import SettingsForm from "../settings/SettingsForm";
import { componentTypes } from "@data-driven-forms/react-form-renderer";
import { useDispatch, useSelector } from "react-redux";
import MyModal from "../modal/MyModal";
import { settingsDialogOpen, updateSettings } from "../../redux/actions/appState";

const schema = {
	title: "Settings",
	fields: [
		{
			component: componentTypes.SUB_FORM,
			title: "General",
			description: "",
			name: "general",
			fields: [
				{
					component: componentTypes.TEXT_FIELD,
					name: "serverAddress",
					label: "Server address",
				},
			],
		},
		{
			component: componentTypes.SUB_FORM,
			title: "Performance",
			description: "",
			name: "performance",
			fields: [
				{
					component: componentTypes.SWITCH,
					name: "animation",
					label: "Use animations",
				},
				{
					component: componentTypes.SWITCH,
					name: "animationsAccordingToChargingStatus",
					label: "Make animations enabled based on the charging status of the device",
				},
			],
		},
		{
			component: componentTypes.SUB_FORM,
			title: "Appearance",
			description: "",
			name: "appearance",
			fields: [
				{
					component: componentTypes.SWITCH,
					name: "darkMode",
					label: "Dark mode",
				},
				{
					component: componentTypes.TEXT_FIELD,
					name: "numberOfColumns",
					label: "Number of columns in the grid",
				},
			],
		},
	],
};

const getInitialSettings = currentSettings => {
	return {
		animation: currentSettings.performance.animation,
		animationsAccordingToChargingStatus: currentSettings.performance.animationsAccordingToChargingStatus,
		darkMode: currentSettings.appearance.darkMode,
		serverAddress: currentSettings.connection.address.host,
	};
};

const SettingsDialog = ({ appElement }) => {
	const dispatch = useDispatch();

	const colors = useSelector(state => state.settings.appearance.colors);
	const isOpen = useSelector(state => state.appState.settingsPaneOpen);

	const requestClosing = () => dispatch(settingsDialogOpen(false));

	const currentSettings = useSelector(state => state.settings);

	const onSubmit = newSettings => {
		dispatch(updateSettings(newSettings));
	};

	return (
		<MyModal isOpen={isOpen} appElement={appElement} onRequestClose={requestClosing}>
			<div>
				<div className="modal-close" onClick={requestClosing} />
				<SettingsForm
					requestClosing={requestClosing}
					initialValues={getInitialSettings(currentSettings)}
					schema={schema}
					onSubmit={onSubmit}
				/>
			</div>
		</MyModal>
	);
};

export default SettingsDialog;
