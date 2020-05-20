import React from 'react';
import "./numberdisplay.css";

const ReactFitText = require("react-fittext");

class NumberDisplay extends React.Component {
    render() {
        let wholePart = Math.floor(this.props.value).toFixed(0);
        let decimalPart = "." + (Math.abs(((this.props.value - Math.trunc(this.props.value)) * 10 ** this.props.decimalPlaces)).toFixed(0) + "").slice(0, this.props.decimalPlaces);


        return (
            <div className="displayContainer" style={{width: `${this.props.width}px`, height: `${this.props.height}px`}}>

                <div className="value">
                    <h1>
                        {wholePart}
                    </h1>
                    <span>
                        {decimalPart}
                        {this.props.suffix + " "}
                    </span>
                    <i>
                        {this.props.unit}
                    </i>
                </div>
                <div className="label">
                    {this.props.legend}
                </div>
            </div>
        );
    }
}

export default NumberDisplay;
