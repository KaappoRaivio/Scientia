import React from 'react';

import "./numberdisplay.css";

class NumberDisplay extends React.Component {

    componentDidMount () {
        this.canvas = this.refs.canvas;
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.font = this.props.fontSize + "px Courier";

        let measureText = this.props.upperBound;
        let text1 = this.props.value.toFixed(0);
        let text3 = "." + (Math.abs(((this.props.value - Math.trunc(this.props.value)) * 10 ** this.props.decimalPlaces)).toFixed(0) + "").slice(0, this.props.decimalPlaces) + this.props.suffix + " " + this.props.unit;

        let containerWidth = ctx.measureText(measureText).width ;

        let measure = ctx.measureText(text1);
        let width = measure.width;
        ctx.fillText(text1, containerWidth - width, (this.canvas.height + measure.actualBoundingBoxAscent) / 2);
        
        ctx.font = this.props.fontSize * 0.5 + "px Courier";
        ctx.fillText(text3, containerWidth, (this.canvas.height + measure.actualBoundingBoxAscent) / 2);

        ctx.font = this.props.fontSize * 0.25 + "px Courier";
        let legend = this.props.legend;
        ctx.fillText(legend, 10, 30);

    }

    componentDidUpdate () {
        this.componentDidMount()
    }

    render() {
        return (
            <div className="displayContainer">
                <canvas ref="canvas" width={this.props.width} height={this.props.height}/>
            </div>
        );
    }
}

export default NumberDisplay;
