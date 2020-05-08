import React from 'react';

import "/home/kaappo/testit/canvas/src/components/numberdisplay.css";

class NumberDisplay extends React.Component {
    constructor(props) {
        super(props);

        // this.props = {
        //     value: props.value,
        //     suffix: props.suffix,
        //     unit: props.unit,
        //     upperBound: props.upperBound,
        //     decimalPlaces: props.decimalPlaces,

        //     width: props.width,
        //     height: props.height,
        //     fontSize: props.fontSize
        // }
        console.log(this.props)
    }

    componentDidMount () {
        this.canvas = this.refs.canvas;
        const ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        ctx.font = this.props.fontSize + "px Courier"

        let measure = this.props.upperBound.toFixed(this.props.decimalPlaces) + this.props.suffix + " " + this.props.unit
        let text1 = this.props.value.toFixed(0);
        let text2 = "."
        let text3 = "." + ((this.props.value - Math.trunc(this.props.value)) * 10 ** this.props.decimalPlaces).toFixed(0) + this.props.suffix + " " + this.props.unit

        // let size = ctx.measureText(measure);
        // console.log(size)
        // ctx.fillText(text, (this.canvas.width - size.width) / 2, (this.canvas.height + size.actualBoundingBoxAscent) / 2)
        let width = ctx.measureText(text1).width 
        ctx.fillText(text1, this.canvas.width / 2 - width, this.canvas.height / 2)
        ctx.font = this.props.fontSize * 0.5 + "px Courier"
        ctx.fillText(text3, this.canvas.width / 2, this.canvas.height / 2)

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
