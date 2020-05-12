import React from 'react';

import { mod } from "mathjs";
import NumberDisplay from "./numberdisplay.js"
import DrawHelper from './helpers';

import "./wind.css"
import "./instruments.css"
import "./compass.css"

import Interpolator from "./misc/interpolate.js"
import Tridata from './tridata.js';

class Wind extends React.Component {
    constructor (props) {
        super(props);
        this.data = {};

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

            width: props.width,
            height: props.height,
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
                this.data.interpolators.true.addDataPoint(new Date().getTime(), this.state.angleTrueWater);
            } else if (path === "angleApparent") {
                this.data.interpolators.app.addDataPoint(new Date().getTime(), this.state.angleApparent);
            } else if (path === "speedTrue") {
                this.data.interpolators.speedTrue.addDataPoint(new Date().getTime(), this.state.speedTrue);
            }
        };
        // eslint-disable-next-line no-useless-escape
        this.props.subscribe(["environment\.wind\..+"], this.onMessage.bind(this));

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

    componentDidMount() {
        this.subscribe();
        console.log(window.innerHeight, window.innerWidth);

        const canvas = this.refs.canvas_background;

        let width = this.refs.container.clientWidth;
        let height = this.refs.container.clientHeight;
        console.log(height, width);
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        const canvas_update = this.refs.canvas_update;
        canvas_update.width = width;
        canvas_update.height = height;

        const ctx_update = canvas_update.getContext("2d");

        this.data = {
            canvas_background: canvas,
            ctx_background: ctx,

            canvas_update: canvas_update,
            ctx_update: ctx_update,

            drawHelper: new DrawHelper(canvas, ctx),
            interpolators: {
                true: new Interpolator(true),  
                app: new Interpolator(true),
                speedTrue: new Interpolator(),
            },
                
            compassLineMaxLength: canvas.width / 2.1 / 20,
            origin: [canvas.width / 2, canvas.height / 2],
            radius: canvas.width / 2.1,
        };

        this.drawBackground();
        this.componentDidUpdate();
    }

    drawBackground() {
        const ctx = this.data.ctx_background;
        const canvas = this.data.canvas_background;

        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, this.data.radius, 0, 2 * Math.PI);
        ctx.font = canvas.width / 20 + "px Courier";

        const divisions = [[24, 0.5], [72, 1]];
        for (const division of divisions) {
            let angleProvider = (index) => {
                return 2 * Math.PI / division[0] * index;
            };

            let numberTextProvider = (index) => {
                if (division[0] === 24) {
                    let baseAngle = angleProvider(index);
                    return baseAngle / Math.PI * 180 <= 180 ? mod(baseAngle / Math.PI * 180, 360).toFixed(0) : mod(360 - baseAngle / Math.PI * 180, 360).toFixed(0);
                } else {
                    return "";
                }
            };

            this.data.drawHelper.drawDivision(this.data.origin, this.data.radius, division[0], this.data.compassLineMaxLength / division[1], angleProvider, numberTextProvider, false);
        }

        ctx.closePath();
        ctx.stroke();
    }

    componentDidUpdate() {
        let width = this.refs.container.clientWidth;
        let height = this.refs.container.clientHeight;
        // console.log(width, height)
        // this.data.canvas_background.width = width;
        // this.data.canvas_background.height = height;

        this.data.canvas_update.width = width;
        this.data.canvas_update.height = height;


        const ctx = this.data.ctx_update;
        const canvas = this.data.canvas_update;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawCloseHaulMarks();
        this.drawPointer();
    }

    drawCloseHaulMarks () {
        const ctx = this.data.ctx_update;
        ctx.beginPath();
        ctx.fillStyle = "rgba(0, 200, 0, 0.75)";
        ctx.arc(this.data.origin[0], this.data.origin[1], this.data.radius, -Math.PI / 2, (90 - this.state.closeHaulAngle) / 180 * -Math.PI, false);
        ctx.arc(this.data.origin[0], this.data.origin[1], this.data.radius - this.data.compassLineMaxLength, (90 - this.state.closeHaulAngle) / 180 * -Math.PI, -Math.PI / 2, true);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 150, 125, 0.75)";
        ctx.arc(this.data.origin[0], this.data.origin[1], this.data.radius, -Math.PI - (90 - this.state.closeHaulAngle) / 180 * -Math.PI, -Math.PI / 2, false);
        ctx.arc(this.data.origin[0], this.data.origin[1], this.data.radius - this.data.compassLineMaxLength, -Math.PI / 2, -Math.PI - (90 - this.state.closeHaulAngle) / 180 * -Math.PI, true);
        ctx.closePath();
        ctx.fill();

    }

    drawPointer () {
        const ctx = this.data.ctx_update;
        ctx.lineWidth = 10;
        this.data.drawHelper.ctx = this.data.ctx_update;
        
        ctx.strokeStyle = "rgb(220, 50, 0)";
        ctx.beginPath();
        this.data.drawHelper.drawCompassLine(this.data.origin, this.state.interpolated.angleTrueWater + Math.PI, -this.data.radius + this.data.compassLineMaxLength * 2, this.data.compassLineMaxLength * 2);
        ctx.closePath();
        ctx.stroke();
        
        
        ctx.strokeStyle = "rgb(230, 230, 0)";
        ctx.beginPath();
        this.data.drawHelper.drawCompassLine(this.data.origin, this.state.interpolated.angleApparent + Math.PI, -this.data.radius + this.data.compassLineMaxLength * 2, this.data.compassLineMaxLength* 2);
        ctx.closePath();
        ctx.stroke();
        
        this.data.drawHelper.ctx = this.data.ctx_background;
    }

    render() {
        return <div ref="container" className="container col-3 col-t-4 col-s-6"/*style={{ width: this.props.width, height: this.props.height}}*/>
            {/*<img src=""*/}
            <div ref="layerCentered" className="layerCentered">
                {/*<NumberDisplay*/}
                {/*    value={this.state.interpolated.speedTrue * 3.6 / 1.852}*/}
                {/*    suffix=""*/}
                {/*    unit="kts"*/}
                {/*    width={this.props.width / 2}*/}
                {/*    height={this.props.height / 3}*/}
                {/*    upperBound={99}*/}
                {/*    decimalPlaces={1}*/}
                {/*    fontSize={this.props.width / 6}*/}
                {/*    legend="Tuulen nopeus"*/}
                {/*/>*/}
            </div>
            <canvas ref="canvas_update" className="layer" width={this.state.width} height={this.state.height} />
            <canvas ref="canvas_background" className="layer" width={this.state.width} height={this.state.height} />
        </div>
    }
}

export default Wind