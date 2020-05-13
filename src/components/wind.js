import React from 'react';

import { mod } from "mathjs";
import NumberDisplay from "./numberdisplay.js"
import Needle from "./needle"
import DrawHelper from './helpers';
import "./wind.css"

import Interpolator from "./misc/interpolate.js"

class Wind extends React.Component {
    constructor (props) {
        super(props);
        this.data = {};

        this.state = {
            closeHaulAngle: 41,

            angleTrueWater: 0,
            angleApparent: 0,
            speedTrue: 4,
            speedApparent: 5,


        }

    }

    subscribe() {
        this.counter = 1;
        this.onMessage = (message) => {
            let path = message.values[0].path.split(".")[2];

            if (path in this.state) {
                this.setState({
                    [path]: message.values[0].value
                })
            }
        };
        this.props.subscribe(["environment\.wind\..+"], this.onMessage.bind(this))
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
        };

        this.drawBackground();
        setTimeout(() => this.onResize(), 100);

    }

    drawBackground() {
        const ctx = this.data.ctx_background;

        ctx.beginPath();
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

        this.drawCloseHaulMarks()
    }

    resizeCanvases () {
        console.log("losing everything!")
        this.data.canvas_background.width = this.props.width;
        this.data.canvas_background.height = this.props.height;
        this.data.canvas_update.width = this.props.width;
        this.data.canvas_update.height = this.props.height;
    }

    onResize () {
        this.resizeCanvases();
        this.drawBackground();
    }


    drawCloseHaulMarks () {
        const ctx = this.data.ctx_background;
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


    render() {
        return (
            <div style={{ width: this.props.width + "px", height: this.props.height + "px" }}>
                <div className="layerCentered">
                    <NumberDisplay
                        value={this.state.speedTrue}
                        suffix=""
                        unit="kts"
                        width={this.props.width / 2}
                        height={this.props.height / 3}
                        upperBound={99}
                        decimalPlaces={1}
                        fontSize={this.props.width / 6}
                        legend="Tuulen nopeus (T)"
                    />
                </div>

                <Needle angle={this.state.angleApparent / Math.PI * 180} color="rgb(230, 230, 0)"/>
                <Needle angle={this.state.angleTrueWater / Math.PI * 180} color="rgb(220, 50, 0)"/>

                <canvas ref="canvas_update" className="layer" width={this.props.width} height={this.props.height} />
                <canvas ref="canvas_background" className="layer" width={this.props.width} height={this.props.height} />
            </div>
        )
    }
}

export default Wind