import React from "react";

import FormRenderer, { componentTypes, useFieldApi, useFormApi } from "@data-driven-forms/react-form-renderer";

import "./SettingsForm.css";
import Switch from "react-switch";
import "rc-slider/assets/index.css";
import * as PropTypes from "prop-types";

import ReactDropdown from "react-dropdown";
import "react-dropdown/style.css";

const TextField = props => {
	const { label, input, meta, ...rest } = useFieldApi(props);
	return (
		<div>
			<label htmlFor={input.name} className="form-field-title">
				{label}
			</label>
			<input className="form-field-text" {...input} {...rest} id={input.name} />
			{meta.error && meta.touched && <span className="form-field-title red">{meta.error}</span>}
		</div>
	);
};

const Checkbox = props => {
	const { label, input } = useFieldApi(props);

	return (
		<div style={{ display: "flex", flexDirection: "inline" }}>
			<span className="form-field-title">{label}</span>
			<Switch
				className="form-field-switch"
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
	);
};

const DropDown = props => {
	const api = useFieldApi(props);

	return (
		<div>
			<ReactDropdown value={api.input.value} onChange={api.input.onChange} options={api.options} placeholder={api.label} />
		</div>
	);
};

const MyFieldArray = props => {
	const { fields, fieldKey } = useFieldApi(props);
	const { renderForm } = useFormApi();

	return (
		<div>
			{renderForm(fields)}
			<button
				className="button form-cancel"
				onClick={() =>
					fields.push({
						...fields[0],
						name: `${fieldKey}.${fields.length}`,
					})
				}>
				Add
			</button>
		</div>
	);
};

const Section = props => {
	const { fields } = props;
	const { renderForm } = useFormApi();
	const { title } = useFieldApi(props);

	return (
		<div className="form-field-container with-shadow">
			<div className="form-subsection">{title}</div>
			{renderForm(fields).map(field => (
				<div className="form-subsection-field">{field}</div>
			))}
		</div>
	);
};

const MyFormTemplate = props => {
	let { schema, formFields } = props;
	console.log(schema);
	const { handleSubmit, onCancel } = useFormApi();

	return (
		<div className="form-template-parent" onSubmit={handleSubmit}>
			{schema.title && <h1 className="form-title">{schema.title}</h1>}
			{schema.explanation && <h2 className="form-subsection">{schema.explanation}</h2>}
			{formFields}
			<hr />
			<div
				className="form-template-buttons"
				style={{
					position: schema.buttonsAtBottom ? "absolute" : "static",
				}}>
				<button className={`button ${schema.isQuadrant ? "small" : ""} form-confirm with-shadow`} type="submit" onClick={handleSubmit}>
					{schema.okButtonText || "Ok"}
				</button>
				{!schema.dontShowCancel && (
					<button className={`button ${schema.isQuadrant ? "small" : ""} form-cancel`} type="cancel" onClick={onCancel}>
						Cancel
					</button>
				)}

				{/*<button>Ok</button>*/}
				{!schema.dontShowApply && (
					<button className={`button ${schema.isQuadrant ? "small" : ""} form-cancel`} type="apply">
						Apply
					</button>
				)}
			</div>
		</div>
	);
};

MyFormTemplate.propTypes = {
	schema: PropTypes.any,
	formFields: PropTypes.any,
};

const myComponentMapper = {
	[componentTypes.TEXT_FIELD]: TextField,
	[componentTypes.CHECKBOX]: Checkbox,
	[componentTypes.SWITCH]: Checkbox,
	[componentTypes.SELECT]: DropDown,
	// [componentTypes.PLAIN_TEXT]: PlainText,
	[componentTypes.SUB_FORM]: Section,
	[componentTypes.FIELD_ARRAY]: MyFieldArray,
	"custom-type": TextField,
};

const SettingsForm = ({ onSettingsUpdate, requestClosing, initialValues, schema, buttonsInDocumentFlow }) => {
	const onSubmit = (values, formApi) => {
		console.log(formApi, values);
		onSettingsUpdate(values);
		requestClosing();
	};

	const onCancel = (values, formApi) => {
		console.log("Canceling form!");
		requestClosing();
	};

	return (
		<FormRenderer
			style={{ position: "relative", height: "100%" }}
			schema={schema}
			initialValues={initialValues}
			componentMapper={myComponentMapper}
			FormTemplate={MyFormTemplate}
			onSubmit={onSubmit}
			onCancel={onCancel}
		/>
	);
};

export default SettingsForm;
