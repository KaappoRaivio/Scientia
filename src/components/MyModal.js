import React from 'react';
import Modal from "react-modal";

// import componentTypes from "@data-driven-forms/react-form-renderer/dist/cjs/component-types";
// import FormRenderer from "@data-driven-forms/react-form-renderer/dist/cjs/form-renderer";
// import { componenMapper, FormTemplate } from "@data-driven"
import "./MyModal.css"
import SettingsForm from "../SettingsForm";
// import { componentMapper } from '@data-driven-forms/pf4-component-mapper';

const MyModal = ({colors, darkMode, isModalOpen, requestClosing, ...rest}) => {

    // Modal.defaultStyles.content.border = "none";
    // Modal.defaultStyles.content.color = colors.primary;
    // Modal.defaultStyles.content.background = colors.background;
    // Modal.defaultStyles.overlay.backgroundColor = "rgba(255, 255 255, 0.75)";

    return (
        <Modal className="modal-parent with-shadow"
            style={{
                overlay: {backgroundColor: "rgba(0, 0, 0, 0.5)"},
                content: {backgroundColor: colors.background, color: colors.primary}
            }}
            isOpen={isModalOpen}
            onRequestClose={requestClosing}>
            <div>
                <div className="modal-close" onClick={requestClosing}/>
                <SettingsForm requestClosing={requestClosing} colors={colors} {...rest}/>
            </div>
        </Modal>
    );
};

export default MyModal;