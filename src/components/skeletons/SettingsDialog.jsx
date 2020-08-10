import React from "react";
import Modal from "react-modal";

import "./SettingsDialog.css";
import SettingsForm from "../settings/SettingsForm";
import { componentTypes } from "@data-driven-forms/react-form-renderer";

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

const SettingsDialog = ({ colors, darkMode, isModalOpen, requestClosing, appElement, ...rest }) => (
	<Modal
		className="modal-parent with-shadow"
		style={{
			overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
			content: {
				backgroundColor: colors.background,
				color: colors.primary,
			},
		}}
		ariaHideApp={false}
		isOpen={isModalOpen}
		onRequestClose={requestClosing}>
		<div>
			<div className="modal-close" onClick={requestClosing} />
			<SettingsForm requestClosing={requestClosing} colors={colors} schema={schema} {...rest} />
		</div>
	</Modal>
);

export default SettingsDialog;
