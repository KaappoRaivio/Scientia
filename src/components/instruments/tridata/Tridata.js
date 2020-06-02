import NumberDisplay from "../../numberdisplay";
import React from "react";

const Tridata = (props) => {
    const commonUpperBound = props.values.map(value => value.upperBound).reduce((a, b) => a > b ? a : b);
    const colors = props.colors;

    const parentStyle = {
        width: props.width,
        height: props.height,
        color: colors.primary,
        backgroundColor: colors.background,
        position: "relative"
    };

    return <div style={parentStyle}>
        {props.values.map((value, index) => {
            return <NumberDisplay
                key={index}
                value={value.value * value.conversion}

                suffix={value.suffix}
                unit={value.unit}
                legend={value.legend}

                upperBound={commonUpperBound}
                decimalPlaces={value.decimalPlaces}

                fontSize={props.width / 4}
                width={props.width}
                height={props.height / props.values.length}
            />
        })}
    </div>
}

export default Tridata