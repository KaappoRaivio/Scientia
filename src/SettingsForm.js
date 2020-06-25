import React from 'react';

import FormRenderer, {componentTypes, useFieldApi, useFormApi} from '@data-driven-forms/react-form-renderer';
import {componentMapper} from '@data-driven-forms/pf4-component-mapper';

import "./SettingsForm.css";
import Switch from "react-switch";
import * as PropTypes from "prop-types";

const TextField = props => {
    const {label, input, meta, ...rest} = useFieldApi(props)
    console.log(input, meta, rest)
    return (
        <div>
            <div className="form-field-title">{label}</div>
            <input className="form-field-text" {...input} {...rest} id={input.name}/>
            {meta.error
                ? <p>{meta.error}</p>
                : null}
        </div>
    )
}

const Checkbox = props => {
    const { label, input } = useFieldApi(props)

    console.log(input)
    return (
        <div style={{display: "flex", flexDirection: "inline"}}>

            <span className="form-field-title">{label}</span>
            <Switch className="form-field-switch"
                    checked={input.value}
                    onChange={input.onChange}
                    onColor={"#ff8686"}
                    onHandleColor={"#e62626"}
                    handleDiameter={30}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    height={20}
                    width={48}
            />
        </div>
    )
}

const Section = props => {
    const { fields } = props;
    const { renderForm } = useFormApi();
    const { title } = useFieldApi(props);

    return <div className="form-field-container with-shadow">
        <div className="form-subsection">{title}</div>
            {renderForm(fields).map(field => <div className="form-subsection-field">
                {field}
            </div>)}
    </div>
}

const MyFormTemplate = props => {
    let {schema, formFields} = props;
    const {handleSubmit, onReset, onCancel} = useFormApi();

    console.log(formFields)

    return (
        <form className="form-template-parent" onSubmit={handleSubmit} onReset={onReset} onCancel={onCancel}>
            <h1 className="form-title">{schema.title}</h1>
            {formFields}
            <hr />
            <div className="form-template-buttons" style={{display: "inline"}}>
                <button className="button form-confirm with-shadow" type="submit">Ok</button>
                <button className="button form-cancel" type="cancel">Cancel</button>
                <button className="button form-cancel" type="apply">Apply</button>
            </div>
        </form>
    )
};

MyFormTemplate.propTypes = {
    schema: PropTypes.any,
    formFields: PropTypes.any
}

const myComponentMapper = {
    [componentTypes.TEXT_FIELD]: TextField,
    [componentTypes.CHECKBOX]: Checkbox,
    [componentTypes.SWITCH]: Checkbox,
    // [componentTypes.PLAIN_TEXT]: PlainText,
    [componentTypes.SUB_FORM]: Section,
    'custom-type': TextField
}

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
                    name: 'serverAddress',
                    label: 'Server address'
                },
            ]
        },
        {
            component: componentTypes.SUB_FORM,
            title: "Performance",
            description: "",
            name: "performance",
            fields: [
                {
                    component: componentTypes.SWITCH,
                    name: "animate",
                    label: "Animate"
                },
            ]
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
                    label: "Dark mode"
                }
            ]
        }
    ]
}


const SettingsForm = ({onSettingsUpdate, requestClosing, initialValues}) => {
    console.log(myComponentMapper, schema)


    const test = (values, formApi) => {
        console.log(values, formApi);
        onSettingsUpdate(values);
        requestClosing();
    }

    return (
        <FormRenderer style={{height: "100%"}} schema={schema}
            initialValues={initialValues}
            componentMapper={myComponentMapper}
            FormTemplate={MyFormTemplate}
            onSubmit={test}/>
    );
};

export default SettingsForm;