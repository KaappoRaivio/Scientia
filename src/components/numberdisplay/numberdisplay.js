import React from 'react';
import "./numberdisplay.css";
import NumberDisplayLabel from "./NumberDisplayLabel";
import NumberDisplayValue from "./NumberDisplayValue";
import ScaleText from "react-scale-text";
import AutoFitTextBox from "./AutoFitTextBox";


const NumberDisplay = ({decimalPlaces, height, legend, suffix, unit, upperBound, value, width, centerLabel, debug}) => {
    // console.log(width, height)

    const actualWidth = width / 1;
    const actualHeight = height / 1;

    let valueMaxLength = upperBound.toString().length + ".".length + decimalPlaces + suffix.length;


    return (
        <div className="displayContainer" style={{width: `${actualWidth}px`, height: `${actualHeight}px`}}>
             {/*<NumberDisplayValue upperBound={upperBound} decimalPlaces={decimalPlaces} suffix={suffix} value={value} />*/}
             {/*<div className="label">*/}
             {/*    <NumberDisplayLabel legend={legend} unit={unit} />*/}
             {/*</div>*/}
            <svg className="numberdisplay-svg" width={`${actualWidth}px`} height={`${actualHeight}px`} fill={"black"} stroke={"none"}>
                {/*<AutoFitTextBox maxNumberOfDigits={15} value={value.toFixed(10)}*/}
                {/*                initialFontSize={60} width={actualWidth} height={actualHeight}/>*/}
                {/*<g x={"50%"} y={"10px"}>*/}
                {/*    <AutoFitTextBox maxNumberOfDigits={15} value={value.toFixed(10)}*/}
                {/*                initialFontSize={60} width={actualWidth} height={actualHeight}/>*/}

                {/*</g>*/}
                {/*<text y={10}>null</text>*/}
                <g fill={"black"}>
                    {/*{debug && <rect width={width * 0.94} height={"25%"} fill={"orange"}/>}*/}
                    {centerLabel ?
                        <AutoFitTextBox x="50%" y="25%" maxNumberOfDigits={legend.length} value={legend}
                                        initialFontSize={60} width={actualWidth * 0.94} height={actualHeight * 0.25}
                                        textAnchor={"middle"}
                        /> :
                        <AutoFitTextBox x="3%" y="25%" maxNumberOfDigits={legend.length} value={legend}
                                             initialFontSize={60} width={actualWidth * 0.94} height={actualHeight * 0.25}
                        />

                    }


                    {/*{debug && <rect width={"80%"} height={"75%"} y={"25%"} fill={"yellow"}/>}*/}
                    <AutoFitTextBox x="3%" y="90%" maxNumberOfDigits={valueMaxLength} value={value.toFixed(decimalPlaces) + suffix}
                                    initialFontSize={60} width={actualWidth * 0.57} height={actualHeight * 0.75}/>


                    {/*{debug && <rect width={"20%"} height={"50%"} x={"80%"} y={"50%"} fill={"lightgreen"}/>}*/}
                    <AutoFitTextBox x="60%" y="90%" maxNumberOfDigits={unit.length} value={" " + unit}
                                    initialFontSize={60} width={actualWidth * 0.37} height={actualHeight / 2}/>

                </g>
            </svg>
        </div>
    );
}

export default NumberDisplay;
