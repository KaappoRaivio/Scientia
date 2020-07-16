import React from "react";

const RemoveInstrument = ({height, width, onRemoveClick, enabled}) => {
    // const svgSize = {width: width / 10, height: height / 10};
    const svgSize = {width: 50, height: 50};
    const lineLength = 0.75;
    // console.log(enabled)

    return <svg className={`remove-instrument ${enabled ? "" : "disabled"}`} width={svgSize.width}
                height={svgSize.height} onClick={onRemoveClick}>
        {/*<circle cx={svgSize.width / 2} cy={svgSize.height / 2} r={svgSize.width / 2} fill={"gray"} strokeWidth={0}/>*/}
        <g strokeWidth={svgSize.width * 0.1} stroke={"gray"} strokeLinecap="round">
            <line x1={svgSize.width * (1 - lineLength)} x2={svgSize.width * lineLength}
                  y1={svgSize.height * (1 - lineLength)} y2={svgSize.height * lineLength}/>
            <line x2={svgSize.width * (1 - lineLength)} x1={svgSize.width * lineLength}
                  y1={svgSize.height * (1 - lineLength)} y2={svgSize.height * lineLength}/>
        </g>
    </svg>
}

export default RemoveInstrument;