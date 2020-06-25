import React from 'react';

import plusIcon from "../../assets/plus_icon.svg"
import "./AddInstrument.css"

const AddInstrument = ({onInstrumentAdded, width, height, colors, darkMode}) => {

    const lineWidth = 3;

    const svgSize = {x: width / 2.5, y: height / 2.5};
    const center = {x: svgSize.x / 2, y: svgSize.y / 2};

    return (
        <div onClick={console.log} className="addinstrument-parent">
            {/*<div className="addinstrument-plus">＋</div>*/}
            {/*<svg*/}
            {/*<img src={plusIcon} width={width / 2.5} alt={"plus"}/>*/}
            <svg width={svgSize.x} height={svgSize.y} strokeWidth={lineWidth} stroke={colors.primary}>
                {/*<path style={{fillRule: "evenodd"}} fillRule="evenodd" d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"/>*/}
                {/*<line x1={0} y1={0} x2={width} y2={height}/>*/}
                {/*<rect x={center.x * 0.6} y={center.y * 0.95} width={center.x * 0.8} height={center.y * 0.1}/>*/}
                {/*<rect x={center.x * 0.95} y={center.y * 0.6} width={center.x * 0.1} height={center.y * 0.8}/>*/}
                <line x1={center.x} y1={lineWidth / 2} x2={center.x} y2={svgSize.y - lineWidth / 2} strokeLinecap={"round"}/>
                <line x1={lineWidth / 2} y1={center.y} x2={svgSize.x - lineWidth / 2} y2={center.x} strokeLinecap={"round"}/>

                <rect width={width} height={height} fill={darkMode ? "none" : "rgba(255, 255, 255, 0.75)"} stroke={"none"}/>
            </svg>
        </div>
    );
};

export default AddInstrument;