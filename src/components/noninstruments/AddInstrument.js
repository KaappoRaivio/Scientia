import React, {useState} from 'react';

import plusIcon from "../../assets/plus_icon.svg"
import "./AddInstrument.css"
import TridataContainer from "../instruments/tridata/TridataContainer";
import SettingsForm from "../../SettingsForm";
import {componentTypes} from "@data-driven-forms/react-form-renderer";
import WindContainer from "../instruments/wind/WindContainer";
import GaugeContainer from "../instruments/gauge/GaugeContainer";
import CompassContainer from "../instruments/compass/CompassContainer";
import ReactDropdown from "react-dropdown";

const schema = {
    buttonsAtBottom: true,
    dontShowApply: true,
};

const mergeFields = fields => {
    if (fields == null || fields === []) return null;
    return {...schema, fields}
}

const spinnerSchema = {
    component: "select",
    name: "instrument",
    label: "Select instrument",
    options: [
        {
            label: "Wind",
            value: WindContainer
        },
        {
            label: "Tridata",
            value: TridataContainer
        },
        {
            label: "Gauge",
            value: GaugeContainer
        },
        {
            label: "Compass",
            value: CompassContainer
        }
    ]
};


const AddInstrument = ({onInstrumentAdded, width, height, colors, darkMode}) => {

    const lineWidth = 3;

    const svgSize = {x: width / 2.5, y: height / 2.5};
    const center = {x: svgSize.x / 2, y: svgSize.y / 2};

    const [ plusPressed, setPlusPressed ] = useState(false);
    const [ selectedItem, setSelectedItem ] = useState(spinnerSchema.options[1]);

    const onConfirm = options => {
        onInstrumentAdded({
            type: "single",
            instruments: [
                {
                    component: selectedItem.value,
                    additionalProps: options
                }
            ]
        });
    }

    const onSpinnerChange = selectedItem => {
        setSelectedItem(selectedItem);
        console.log(selectedItem)
    }

    if (!plusPressed) {
        return (
            <div onClick={() => setPlusPressed(true)} className="addinstrument-parent">
                <svg width={svgSize.x} height={svgSize.y} strokeWidth={lineWidth} stroke={colors.primary}>
                    <line x1={center.x} y1={lineWidth / 2} x2={center.x} y2={svgSize.y - lineWidth / 2} strokeLinecap={"round"}/>
                    <line x1={lineWidth / 2} y1={center.y} x2={svgSize.x - lineWidth / 2} y2={center.x} strokeLinecap={"round"}/>
                    <rect width={width} height={height} fill={darkMode ? "none" : "rgba(255, 255, 255, 0.75)"} stroke={"none"}/>
                </svg>
            </div>
        );
    } else {
        return <div style={{padding: "3%", fontSize: "14px", height: "80%", overflowY: "auto"}}>
            <ReactDropdown value={selectedItem} onChange={onSpinnerChange} options={spinnerSchema.options} placeholder={spinnerSchema.label} />
            <SettingsForm schema={mergeFields(selectedItem.value.schema) || schema} onSettingsUpdate={onConfirm} requestClosing={() => setPlusPressed(false)}/>
        </div>
    }
};

export default AddInstrument;