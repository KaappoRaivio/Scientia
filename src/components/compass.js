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
    }

    getCircleRadius (canvasWidth, offsetY) {
        return Math.sqrt((canvasWidth / 2) ** 2 + offsetY ** 2) / 1.05
    }

    componentDidMount() {
        this.subscribe();
        
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext("2d");
        
        const arcCenterOffsetY = canvas.width / 5;
        const radius = this.getCircleRadius(canvas.width, arcCenterOffsetY);
        
        const compassLineMaxLength = canvas.width / 2 / 10;
        const origin = [canvas.width / 2, canvas.height + arcCenterOffsetY];

        const drawHelper = new DrawHelper(canvas, ctx);

        this.data = {
            canvas_background: canvas,
            ctx_backgroud: ctx,

            compassLineMaxLength: compassLineMaxLength,
            origin: origin,
            radius: radius,
            arcCenterOffsetY: arcCenterOffsetY,

            drawHelper: drawHelper,
            interpolator: new Interpolator(true),
        };

        this.componentDidUpdate();        
    }

    subscribe () {
        this.onMessage = (message) => {
            const extracted = message.values[0].value;
            console.log(extracted / Math.PI * 180 )
            if (message.source.label === "nmeaFromFile") {
                this.setState({ heading: extracted / Math.PI * 180 });

                this.data.interpolator.addDataPoint(new Date().getTime(), extracted);
            }
        };
        this.props.subscribe(["navigation.courseOverGroundTrue"], this.onMessage);

        setInterval(() => {
            let heading = this.data.interpolator.interpolate(new Date().getTime());
            this.setState({
                interpolated: heading / Math.PI * 180
            })
        }, 16)

    }

    componentDidUpdate () {
        const ctx = this.data.ctx_backgroud;
        const canvas = this.data.canvas_background;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height + this.data.arcCenterOffsetY, this.data.radius, 0, 2 * Math.PI);
        ctx.fillRect(this.props.width / 2 - 1, canvas.height - this.data.radius + this.data.arcCenterOffsetY - 10, 2, 10);
        ctx.font = canvas.width / 20 + "px Courier";

        
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

            this.data.drawHelper.drawDivision(this.data.origin, this.data.radius, division[0], this.data.compassLineMaxLength / division[1], angleProvider, numberTextProvider)
        }

        ctx.closePath();
        ctx.stroke();
    }

    render () {
        return <div className="container col-3 col-t-4 col-s-6" style={{width: this.props.width + "px", height: this.props.height + "px"}}>
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