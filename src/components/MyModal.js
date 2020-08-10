import React from "react";
import Modal from "react-modal";

// import componentTypes from "@data-driven-forms/react-form-renderer/dist/cjs/component-types";
// import FormRenderer from "@data-driven-forms/react-form-renderer/dist/cjs/form-renderer";
// import { componenMapper, FormTemplate } from "@data-driven"
import "./MyModal.css";
import SettingsForm from "../SettingsForm";
import { componentTypes } from "@data-driven-forms/react-form-renderer";
// import { componentMapper } from '@data-driven-forms/pf4-component-mapper';

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

const MyModal = ({ colors, darkMode, isModalOpen, requestClosing, appElement, ...rest }) => {
	// Modal.defaultStyles.content.border = "none";
	// Modal.defaultStyles.content.color = colors.primary;
	// Modal.defaultStyles.content.background = colors.background;
	// Modal.defaultStyles.overlay.backgroundColor = "rgba(255, 255 255, 0.75)";

	return (
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
			onRequestClose={requestClosing}
			// appElement={appElement}
		>
			<div>
				<div className="modal-close" onClick={requestClosing} />
				<SettingsForm requestClosing={requestClosing} colors={colors} schema={schema} {...rest} />
			</div>
		</Modal>
	);
};

export default MyModal;
