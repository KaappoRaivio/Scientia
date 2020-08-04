import React, {useState} from 'react';
import "./AddInstrument.css"

import SettingsForm from "../../SettingsForm";

import ReactDropdown from "react-dropdown";
import {stringToClass} from "../instruments";

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
            value: {
                component: "WindContainer",
            }
        },
        {
            label: "Tridata",
            value: {
                component: "TridataContainer",
            }
        },
        {
            label: "Gauge",
            value: {
                component: "GaugeContainer",
            }
        },
        {
            label: "Compass",
            value: {
                component: "CompassContainer",
            }
        },
        {
            label: "Quadrant...",
            value: {
                components: [],
                type: "quadrant"
            }
        }
    ].sort((a  , b) => a.label.localeCompare(b.label))
};


const AddInstrument = ({onInstrumentAdded, width, height, colors, darkMode}) => {

    const lineWidth = 3;

    const svgSize = {x: width / 2.5, y: height / 2.5};
    const center = {x: svgSize.x / 2, y: svgSize.y / 2};

    const [ plusPressed, setPlusPressed ] = useState(false);
    const [ selectedItem, setSelectedItem ] = useState(spinnerSchema.options[0]);

    const onConfirm = options => {
        if (selectedItem.value.type === "quadrant") {
            console.log("quadrant")
            onInstrumentAdded({
                type: "quadrant",
                instruments: selectedItem.value.components
            })
        } else {
            onInstrumentAdded({
                type: "single",
                instruments: [
                    {
                        component: selectedItem.value.component,
                        additionalProps: options
                    }
                ]
            });
        }
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
        return <div style={{padding: "3%", fontSize: "50%", height: "80%", overflowY: "auto"}}>
            <ReactDropdown style={{position: "absolute"}} value={selectedItem} onChange={onSpinnerChange} options={spinnerSchema.options} placeholder={spinnerSchema.label} />
            <SettingsForm schema={mergeFields(stringToClass(selectedItem.value.component)?.schema || [])} onSettingsUpdate={onConfirm} requestClosing={() => {
                setPlusPressed(false);
                setSelectedItem(spinnerSchema.options[0])
            }}/>
        </div>
    }
};

export default AddInstrument;