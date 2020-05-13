import React from 'react';

import { mod } from "mathjs";
import "./compass.css"
import NumberDisplay from "./numberdisplay.js"

import DrawHelper from "./helpers.js"
import Interpolator from './misc/interpolate';

class Compass extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            heading: 0,
            interpolated: 0
        }

        this.interpolate = () => {
            let heading = this.data.interpolator.interpolate(new Date().getTime());
            if (this.state.interpolated !== heading) {
                this.setState({
                    interpolated: heading / Math.PI * 180
                })
            }
        };
    }

    getCircleRadius (canvasWidth, offsetY) {
        return Math.sqrt((canvasWidth / 2) ** 2 + offsetY ** 2) / 1.05
    }

    getRadius () {
        return this.getCircleRadius(this.props.width, this.props.width / 5);
    }

    getOrigin () {
        return [this.props.width / 2, this.props.height / 2 + this.getArcCenterOffsetY()];
    }

    getArcCenterOffsetY() {
        return this.props.width / 5;
    }
    getCompassLineMaxLength ()  {
        return this.props.width / 2 / 10;
    }

    componentDidMount() {
        this.subscribe();
        
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext("2d");
        
        const arcCenterOffsetY = this.props.width / 5;

        // const compassLineMaxLength = ;

        const drawHelper = new DrawHelper(canvas, ctx);

        this.data = {
            canvas_background: canvas,
            ctx_background: ctx,

            // compassLineMaxLength: compassLineMaxLength,
            arcCenterOffsetY: arcCenterOffsetY,

            drawHelper: drawHelper,
            interpolator: new Interpolator(true),
        };

        this.componentDidUpdate();        
    }

    subscribe () {
        this.onMessage = (message) => {
            const extracted = message.values[0].value;
            if (message.source.label === "nmeaFromFile") {
                this.setState({ heading: extracted / Math.PI * 180 });

                this.data.interpolator.addDataPoint(new Date().getTime(), extracted);
            }

            if (!this.props.animate) {
                this.interpolate()
            }
        };
        this.props.subscribe(["navigation.courseOverGroundTrue"], this.onMessage);

        if (this.props.animate) {
            setInterval(this.interpolate, 16)
        }

    }
    resizeCanvases () {
        this.data.canvas_background.width = this.props.width;
        this.data.canvas_background.height = this.props.height / 2;
    }

    componentDidUpdate () {
        this.resizeCanvases();
        const ctx = this.data.ctx_background;
        const canvas = this.data.canvas_background;
        // console.log(canvas.width, canvas.height);

        ctx.clearRect(0, 0, this.props.width, this.props.height);

        ctx.beginPath();
        ctx.arc(...this.getOrigin(), this.getRadius(), 0, 2 * Math.PI);
        ctx.font = this.props.width / 20 + "px Courier";

        ctx.fillRect(this.props.width / 2 - 1, this.props.height / 2 - this.getRadius() + this.getArcCenterOffsetY() - 10, 2, 10)
        
        let divisions = [[24, 1], [72, 2], [144, 3]];
        for (let index = 0; index < divisions.length; index++) {
            let division = divisions[index];
            
            let angleProvider = (index) => {
                let baseAngle = 2 * Math.PI / division[0] * index;
                let angleOffset = this.state.interpolated * Math.PI / 180;
                return baseAngle - angleOffset;
            };

            let numberTextProvider = (index) => {
                if (division[0] === 24) {
                    let baseAngle = angleProvider(index) + this.state.interpolated * Math.PI / 180;
                    return mod(baseAngle / Math.PI * 180, 360).toFixed(0);
                } else {
                    return "";
                }
            };
            this.data.drawHelper.drawDivision(this.getOrigin(), this.getRadius(), division[0], this.getCompassLineMaxLength() / division[1], angleProvider, numberTextProvider)
        }

        ctx.closePath();
        ctx.stroke();
    }

    render () {
        // this.componentDidMount();
        return <div style={{width: this.props.width + "px", height: this.props.height + "px"}}>
            <NumberDisplay 
                className="number" 
                value={this.state.interpolated} 
                suffix="°" 
                unit="T" 
                width={this.props.width} 
                height={this.props.height / 3 * 2} 
                upperBound={360} 
                decimalPlaces={1} 
                fontSize={this.props.width / 4}
                legend="" 
            />
            <canvas ref="canvas" className="compassRose" width={this.props.width} height={this.props.height / 2} />
        </div>
    }


}

export default Compass