import React, {useState} from 'react';

import plusIcon from "../../assets/plus_icon.svg"
import "./AddInstrument.css"
import TridataContainer from "../instruments/tridata/TridataContainer";

const AddInstrument = ({onInstrumentAdded, width, height, colors, darkMode}) => {

    const lineWidth = 3;

    const svgSize = {x: width / 2.5, y: height / 2.5};
    const center = {x: svgSize.x / 2, y: svgSize.y / 2};

    const [ plusPressed, setPlusPressed ] = useState(false);

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
        return <div onClick={() => {
            setPlusPressed(false);
            onInstrumentAdded({
                type: "single",
                instruments: [
                    {
                        component: TridataContainer,
                        additionalProps: {
                            paths: [
                                "environment.depth.belowTransducer",
                                "navigation.speedOverGround"
                            ]
                        }
                    }
                ]
            });
        }}>
            Add instrument here

        </div>
    }
};

export default AddInstrument;