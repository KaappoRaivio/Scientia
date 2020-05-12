import React from 'react';

import { mod } from "mathjs";
import NumberDisplay from "./numberdisplay.js"
import DrawHelper from './helpers';
import "./wind.css"

import Interpolator from "./misc/interpolate.js"
import Tridata from './tridata.js';

class Wind extends React.Component {
    constructor (props) {
        super(props);
        this.data = {}

        this.state = {
            closeHaulAngle: 41,

            "angleTrueWater": 0,
            "angleApparent": 0,
            "speedTrue": 4,
            "speedApparent": 5,

            interpolated: {
                angleTrueWater: 0,
                angleApparent: 0,
                speedTrue: 0,
            },
        }

    }

    subscribe() {
        this.counter = 1;
        this.onMessage = (message) => {
            let path = message.values[0].path.split(".")[2];

            // if (path === "angleTrueWater") {
            //     this.setState((state) => {
            //         let left = 95;
            //         let right = -95;
            //         return {
            //             // angleTrueWater: state.angleTrueWater === left / 180 * Math.PI ? right / 180 * Math.PI : left / 180 * Math.PI,
            //             angleApparent: state.angleApparent === left / 180 * Math.PI ? right / 180 * Math.PI : left / 180 * Math.PI
            //         }
            //     })
            //     this.data.interpolators.true.addDataPoint(new Date().getTime(), this.state["angleTrueWater"]);
            //     this.data.interpolators.app.addDataPoint(new Date().getTime(), this.state.angleApparent);
            //     return;
            // } else {
            //     return;
            // }

            if (path in this.state) {
                this.setState({
                    [path]: message.values[0].value
                })
            }

            if (path === "angleTrueWater") {
                this.data.interpolators.true.addDataPoint(new Date().getTime(), this.state["angleTrueWater"]);
            } else if (path === "angleApparent") {
                this.data.interpolators.app.addDataPoint(new Date().getTime(), this.state.angleApparent);
            } else if (path === "speedTrue") {
                this.data.interpolators.speedTrue.addDataPoint(new Date().getTime(), this.state.speedTrue);
            }
        }
        this.props.subscribe(["environment\.wind\..+"], this.onMessage.bind(this))

        setInterval(() => {
            let trueValue = this.data.interpolators.true.interpolate(new Date().getTime());
            let trueSpeed = this.data.interpolators.speedTrue.interpolate(new Date().getTime());
            let apparentValue = this.data.interpolators.app.interpolate(new Date().getTime());
            this.setState({
                interpolated: {
                    angleTrueWater: trueValue,
                    angleApparent: apparentValue,
                    speedTrue: trueSpeed,
                }
            })
        }, 16)
    }
    
    getCompassLineMaxLength () {
        return Math.round(this.props.width / 2.1 / 20);
    }
    
    getOrigin () {
        return [Math.round(this.props.width / 2), Math.round(this.props.height / 2)];
    }
    
    getRadius () {
        return Math.round(this.props.width / 2.1);
    }

    componentDidMount() {
        this.subscribe()

        const canvas = this.refs.canvas_background_1;
        const ctx = canvas.getContext("2d");

        const canvas_update_1 = this.refs.canvas_update_1;
        const ctx_update = canvas_update_1.getContext("2d");

        this.data = {
            canvas_background_1: canvas,
            ctx_background: ctx,

            canvas_update_1: canvas_update_1,
            ctx_update: ctx_update,

            drawHelper: new DrawHelper(canvas, ctx),
            interpolators: {
                true: new Interpolator(true),
                app: new Interpolator(true),
                speedTrue: new Interpolator(),
            },
            
        };

        this.drawBackground();
        this.componentDidUpdate();
    }

    drawBackground() {
        const ctx = this.data.ctx_background;
        const canvas = this.data.canvas_background_1;


        ctx.beginPath();
        // console.log(this.getRadius())
        ctx.arc(this.props.width / 2, this.props.height / 2, this.getRadius(), 0, 2 * Math.PI);
        ctx.font = this.props.width / 22 + "px Courier"

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

            this.data.drawHelper.drawDivision(this.getOrigin(), this.getRadius(), division[0], this.getCompassLineMaxLength() / division[1], angleProvider, numberTextProvider, false);
        }

        ctx.closePath();
        ctx.stroke();
    }

    resizeCanvases () {

        this.data.canvas_background_1.width = this.props.width;
        this.data.canvas_background_1.height = this.props.height;
        this.data.canvas_update_1.width = this.props.width;
        this.data.canvas_update_1.height = this.props.height;
    }

    componentDidUpdate() {
        // this.componentDidMount()
        this.resizeCanvases();
        this.drawBackground();
        const ctx = this.data.ctx_update;
        ctx.clearRect(0, 0, this.props.width, this.props.height);
        this.drawCloseHaulMarks();
        this.drawPointer();

    }

    drawCloseHaulMarks () {
        const ctx = this.data.ctx_update;
        ctx.beginPath();
        ctx.fillStyle = "rgba(0, 200, 0, 0.75)"
        ctx.arc(this.getOrigin()[0], this.getOrigin()[1], this.getRadius(), -Math.PI / 2, (90 - this.state.closeHaulAngle) / 180 * -Math.PI, false);
        ctx.arc(this.getOrigin()[0], this.getOrigin()[1], this.getRadius() - this.getCompassLineMaxLength(), (90 - this.state.closeHaulAngle) / 180 * -Math.PI, -Math.PI / 2, true);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 150, 125, 0.75)"
        ctx.arc(this.getOrigin()[0], this.getOrigin()[1], this.getRadius(), -Math.PI - (90 - this.state.closeHaulAngle) / 180 * -Math.PI, -Math.PI / 2, false);
        ctx.arc(this.getOrigin()[0], this.getOrigin()[1], this.getRadius() - this.getCompassLineMaxLength(), -Math.PI / 2, -Math.PI - (90 - this.state.closeHaulAngle) / 180 * -Math.PI, true);
        ctx.closePath();
        ctx.fill();

    }

    drawPointer () {
        const ctx = this.data.ctx_update;
        ctx.lineWidth = 10;
        this.data.drawHelper.ctx = this.data.ctx_update;

        ctx.strokeStyle = "rgb(220, 50, 0)";
        ctx.beginPath();
        this.data.drawHelper.drawCompassLine(this.getOrigin(), this.state.interpolated.angleTrueWater + Math.PI, -this.getRadius() + this.getCompassLineMaxLength() * 2, this.getCompassLineMaxLength() * 2)
        ctx.closePath();
        ctx.stroke()


        ctx.strokeStyle = "rgb(230, 230, 0)";
        ctx.beginPath()
        this.data.drawHelper.drawCompassLine(this.getOrigin(), this.state.interpolated.angleApparent + Math.PI, -this.getRadius() + this.getCompassLineMaxLength() * 2, this.getCompassLineMaxLength()* 2)
        ctx.closePath();
        ctx.stroke();

        this.data.drawHelper.ctx = this.data.ctx_background;
    }

    render() {
        return <div className="container" style={{ width: this.props.width + "px", height: this.props.height + "px" }}>
            <div className="layerCentered">
                <NumberDisplay
                    value={this.state.interpolated.speedTrue}
                    suffix=""
                    unit="kts"
                    width={this.props.width / 2}
                    height={this.props.height / 3}
                    upperBound={99}
                    decimalPlaces={1}
                    fontSize={this.props.width / 6}
                    legend="Tuulen nopeus"
                />
            </div>
            <canvas ref="canvas_update_1" className="layer" width={this.props.width} height={this.props.height} />
            <canvas ref="canvas_background_1" className="layer" width={this.props.width} height={this.props.height} />
        </div>
    }
}

export default Wind