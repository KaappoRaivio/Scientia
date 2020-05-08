import React from 'react';

import { mod } from "mathjs";
import NumberDisplay from "./numberdisplay.js"
import DrawHelper from './helpers';
// import "./wind.css"


class Wind extends React.Component {
    constructor (props) {
        super(props);
        this.data = {}

        this.state = {
            closeHaulAngle: 41,
            windDirection: {
                true: Math.PI / 2,
                apparent : Math.PI / 2.1
            },

            "angleTrueWater": null,
            "angleApparent": null,
            "speedTrue": null,
            "speedApparent": null,
        }

        this.onMessage = (message) => {
            // console.log("Received wind message: " + JSON.stringify(message));
            let path = message.values[0].path.split(".")[2];

            // console.log("Wind prop: " + path)
            console.log(this.state)

            if (path in this.state) {
                // console.log("moioioioi" + message.values[0].value)
                this.setState({
                    [path]: message.values[0].value
                })
            }
            // console.log("testi")
        }
        this.props.subscribe(["environment\.wind\..+"], this.onMessage)
    }

    componentDidMount() {
        const canvas = this.refs.canvas_background;
        const ctx = canvas.getContext("2d");

        const canvas_update = this.refs.canvas_update;
        const ctx_update = canvas_update.getContext("2d");

        this.data = {
            canvas_background: canvas,
            ctx_background: ctx,

            canvas_update: canvas_update,
            ctx_update: ctx_update,

            drawHelper: new DrawHelper(canvas, ctx),
            
            compassLineMaxLength: canvas.width / 2.1 / 20,
            origin: [canvas.width / 2, canvas.height / 2],
            radius: canvas.width / 2.2,

            image: new Image()
        };
        

        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, this.data.radius, 0, 2 * Math.PI);

        

        const divisions = [[24, 0.5], [72, 1]];
        for (const division of divisions) {
            let angleProvider = (index) => {
                return 2 * Math.PI / division[0] * index;
            }

            let numberTextProvider = (index) => {
                if (division[0] === 24) {
                    let baseAngle = angleProvider(index);
                    return baseAngle / Math.PI * 180 <= 180 ? mod(baseAngle / Math.PI * 180, 360).toFixed(0) : mod(360 - baseAngle / Math.PI * 180, 360).toFixed(0);
                } else {
                    return "";
                }
            }

            this.data.drawHelper.drawDivision(this.data.origin, this.data.radius, division[0], this.data.compassLineMaxLength / division[1], angleProvider, numberTextProvider);
        }
            
        
        ctx.closePath();
        ctx.stroke();

        this.componentDidUpdate();
    }


    componentDidUpdate() {
        const ctx = this.data.ctx_update;
        const canvas = this.data.canvas_update;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawCloseHaulMarks();
        this.drawPointer();
    }

    // drawDivision(division, length, drawNumbers) {
    //     for (let i = 0; i < division; i++) {
    //         let baseAngle = 2 * Math.PI / division * i;
    //         // let angleOffset = this.props.heading * Math.PI / 180;
    //         let angleOffset = 0;

    //         this.data.drawHelper.drawCompassLine(this.data.origin, baseAngle + angleOffset, this.data.radius, length)
    //         if (drawNumbers) {
    //             let angleText = baseAngle / Math.PI * 180 <= 180 ? mod(baseAngle / Math.PI * 180, 360) : mod(360 - baseAngle / Math.PI * 180, 360);
    //             this.data.drawHelper.drawAngleText(this.data.origin, baseAngle + angleOffset, this.data.radius - length, angleText.toFixed(0), true)
    //         }
    //     }
    // }

    drawCloseHaulMarks () {
        const ctx = this.data.ctx_update;
        ctx.beginPath();
        ctx.fillStyle = "rgba(0, 200, 0, 0.75)"
        ctx.arc(this.data.origin[0], this.data.origin[1], this.data.radius, -Math.PI / 2, (90 - this.state.closeHaulAngle) / 180 * -Math.PI, false);
        ctx.arc(this.data.origin[0], this.data.origin[1], this.data.radius - this.data.compassLineMaxLength, (90 - this.state.closeHaulAngle) / 180 * -Math.PI, -Math.PI / 2, true);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 150, 125, 0.75)"
        ctx.arc(this.data.origin[0], this.data.origin[1], this.data.radius, -Math.PI - (90 - this.state.closeHaulAngle) / 180 * -Math.PI, -Math.PI / 2, false);
        ctx.arc(this.data.origin[0], this.data.origin[1], this.data.radius - this.data.compassLineMaxLength, -Math.PI / 2, -Math.PI - (90 - this.state.closeHaulAngle) / 180 * -Math.PI, true);
        ctx.closePath();
        ctx.fill();


    }

    drawPointer () {
        const ctx = this.data.ctx_update;
        ctx.strokeStyle = "rgb(220, 50, 0)";
        ctx.lineWidth = 10;
        ctx.beginPath();
        this.data.drawHelper.ctx = this.data.ctx_update;
        this.data.drawHelper.drawCompassLine(this.data.origin, this.state.angleTrueWater + Math.PI, 0, this.data.radius)
        ctx.closePath();
        ctx.stroke()
        ctx.strokeStyle = "rgb(230, 230, 0)";
        ctx.beginPath()
        

        this.data.drawHelper.drawCompassLine(this.data.origin, this.state.angleApparent + Math.PI, 0, this.data.radius)
        this.data.drawHelper.ctx = this.data.ctx_background;
        // ctx.moveTo(250, 250);
        // ctx.lineTo(300, 300);
        ctx.closePath();
        // ctx.fill();
        ctx.stroke();
    }

    render() {
        return <div className="container" style={{ width: this.props.width + "px", height: this.props.height + "px" }}>
            {/* <NumberDisplay
                className="number"
                value={this.props.heading}
                suffix="°"
                unit="T"
                width={this.props.width}
                height={this.props.height / 3 * 2}
                upperBound={360}
                decimalPlaces={1}
                fontSize={this.props.width / 4}
            /> */}
            <canvas ref="canvas_update" className="compassRose" width={this.props.width} height={this.props.height} />
            <canvas ref="canvas_background" className="compassRose" width={this.props.width} height={this.props.height} />
        </div>
    }
}

export default Wind