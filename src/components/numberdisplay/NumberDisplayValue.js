import React from "react";

import "./numberdisplay.css"
import ScaleText from "react-scale-text";



const getDecimalPart = (value, decimalPlaces) => {
    let decimalPart = Math.abs(value - Math.trunc(value)) + "";
    let split = decimalPart.split(".");

    if (split.length < 2) {
        return "0".repeat(decimalPlaces);
    } else {
        return (parseFloat(split[1].slice(0, decimalPlaces)) + "").padEnd(decimalPlaces, "0");
    }
}

const NumberDisplayValue = ({value, upperBound, decimalPlaces, suffix, unit }) => {
    let wholePart = Math.floor(value).toFixed(0).padStart((upperBound + "").length, " ").replace("-", "–");
    let decimalPart = getDecimalPart(value, decimalPlaces)


    // return <div className="value">
    //     <h1>
    //         {"​" + wholePart}
    //     </h1>
    //     <span style={{height: "100%", position: "absolute", right: 0, top: 0, bottom: 0}}>
    //         .{decimalPart}
    //         {suffix + " "}
    //     </span>
    // </div>
    return <div className="numberdisplay-value-parent">
        <Value wholePart={wholePart} decimalPart={decimalPart} suffix={suffix} />
        {/*{unit !== null && unit !== undefined ? <div className="numberdisplay-value-unit">*/}
        {/*    {unit}*/}
        {/*</div> : null}*/}
    </div>
}

const Value = ({ wholePart, decimalPart, suffix }) =>{
    // return <div className="value">
    //     <h1>
    //         {"​" + wholePart}
    //     </h1>
    //     <span>
    //         .{decimalPart}
    //         {suffix + " "}
    //     </span>
    // </div>
    return <div className={"value-parent"}>
        <span className={"test"}>
            {/*<ScaleText widthOnly={true}>*/}
                1.234
            {/*</ScaleText> */}
        </span>
    </div>
    return <div className={"div"}>
        <span className={"span"}>
            This is a test
        </span>
    </div>
}
export default NumberDisplayValue;
