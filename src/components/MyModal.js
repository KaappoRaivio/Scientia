import React from 'react';
import Modal from "react-modal";

// import componentTypes from "@data-driven-forms/react-form-renderer/dist/cjs/component-types";
// import FormRenderer from "@data-driven-forms/react-form-renderer/dist/cjs/form-renderer";
// import { componenMapper, FormTemplate } from "@data-driven"
import FormRenderer, { componentTypes, useFieldApi, useFormApi } from '@data-driven-forms/react-form-renderer';
import "./MyModal.css"
// import { componentMapper } from '@data-driven-forms/pf4-component-mapper';
import { componentMapper, FormTemplate } from '@data-driven-forms/pf4-component-mapper';
// const TextField = props => {
//     const {label, input, meta, ...rest} = useFieldApi(props)
//     return (
//         <div>
//             <label htmlFor={input.name}>{label}</label>
//             <input {...input} {...rest} id={input.name}/>
//             {meta.error && <p>{meta.error}</p>}
//         </div>
//     )
// }

// const FormTemplate = ({schema, formFields}) => {
//     const {handleSubmit} = useFormApi();
//     return (
//         <form onSubmit={handleSubmit}>
//             <h1>{schema.title}</h1>
//             {formFields}
//             <button type="submit">Submit</button>
//         </form>
//     )
// }

// const componentMapper = {
//     [componentTypes.TEXT_FIELD]: TextField,
//     'custom-type': TextField
// }

const schema = {
    title: "Settings",
    fields: [
        {
            component: componentTypes.TEXT_FIELD,
            name: 'serverAddress',
            label: 'Server address'
        },
        {
            component: componentTypes.SWITCH,
            name: "animate",
            label: "Animate"
        },
        {
            component: componentTypes.SWITCH,
            name: "darkMode",
            label: "Dark mode"
        }
    ]
}

const MyModal = ({colors, initialValues, isModalOpen, onSettingsUpdate, requestClosing}) => {
    console.log(componentMapper, schema)

    const test = (values, formApi) => {
        console.log(values, formApi);
        onSettingsUpdate(values);
        requestClosing();
    }

    Modal.defaultStyles.content.border = "none";
    Modal.defaultStyles.content.color = colors.primary;
    Modal.defaultStyles.content.background = colors.background;
    Modal.defaultStyles.overlay.backgroundColor = "rgba(127, 127 127, 0.5)";

    return (
        <Modal
            style={{
                // overlay: {backgroundColor: colors.background},
                content: {backgroundColor: colors.background}
            }}
            isOpen={isModalOpen}
            onRequestClose={requestClosing}>
            <div>
                <div className="modal-close" onClick={requestClosing}/>
                <FormRenderer style={{color: `${colors.primary} !important`}}
                    schema={schema}
                    initialValues={initialValues}
                    componentMapper={componentMapper}
                    FormTemplate={FormTemplate}
                    onSubmit={test}/>

            </div>
        </Modal>
    );
};

export default MyModal;