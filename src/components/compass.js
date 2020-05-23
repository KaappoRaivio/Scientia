import React from 'react';

import NumberDisplay from "./numberdisplay.js"
import Svghelpers from "./misc/svghelpers";

import "./compass.css"
import {mod} from "mathjs";

class Compass extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            heading: 0,
        };

        this.colors = {
            // primary: "#777",
            // background: "#fff",
            primary: "#f00",
            background: "#000"
        }
    }

    getCircleRadius (canvasWidth, offsetY) {
        return Math.sqrt((canvasWidth / 2) ** 2 + offsetY ** 2) / 1.05
    }

    getRadius () {
        return Math.max(this.props.width / 2 - 2, 0)
    }

    getOrigin () {
        return [this.props.width / 2, this.props.height / 2];
    }

    getCompassLineMaxLength ()  {
        return this.props.width / 2 / 10;
    }

    componentDidMount() {
        this.subscribe();
        
        // const canvas = this.refs.canvas;
        // const ctx = canvas.getContext("2d");
        //
        // const drawHelper = new DrawHelper(canvas, ctx);
        //
        // this.data = {
        //     canvas_background: canvas,
        //     ctx_background: ctx,
        //
        //     drawHelper: drawHelper,
        // };

        // this.onResize();
        // setTimeout(() => this.onResize(), 100);
    }

    subscribe () {
        this.onMessage = (message) => {
            const extracted = message.values[0].value;
            // if (message.source.label === "nmeaFromFile") {
            if (true) {
                this.setState({ heading: extracted / Math.PI * 180 });
            }
        };
        this.props.subscribe([/navigation\.courseOverGroundTrue/], this.onMessage);
    }

    // onResize () {
    //     this.data.canvas_background.width = this.props.width;
    //     this.data.canvas_background.height = this.props.height;
    //     this.drawCompassRose();
    //     this.drawBackground();
    // }

    drawBackground () {
        const ctx = this.refs.canvas_static.getContext("2d");
        ctx.fillRect(this.props.width / 2 - 1.5, this.props.height / 2  - 10.5, 2, 10);
        ctx.stroke()

    }

    // drawCompassRose () {
    //     const ctx = this.data.ctx_background;
    //     ctx.clearRect(0, 0, this.props.width, this.props.height);
    //
    //     ctx.beginPath();
    //
    //     ctx.arc(...this.getOrigin(), this.getRadius(), 0, 2 * Math.PI);
    //     ctx.font = this.props.width / 20 + "px Courier";
    //
    //
    //     let divisions = [[24, 1], [72, 2.5], [144, 3]];
    //     for (let index = 0; index < divisions.length; index++) {
    //         let division = divisions[index];
    //
    //         let angleProvider = (index) => 2 * Math.PI / division[0] * index;
    //
    //         let numberTextProvider = (index) => {
    //             if (division[0] === 24) {
    //                 let baseAngle = angleProvider(index);// + this.state.interpolated * Math.PI / 180;
    //                 return mod(baseAngle / Math.PI * 180, 360).toFixed(0);
    //             } else {
    //                 return "";
    //             }
    //         };
    //         this.data.drawHelper.drawDivision(this.getOrigin(), this.getRadius(), division[0], this.getCompassLineMaxLength() / division[1], angleProvider, numberTextProvider)
    //     }
    //
    //     ctx.closePath();
    //     ctx.stroke();
    // }

    render () {
        // this.componentDidMount();
        const centerX = this.props.width / 2;
        const centerY = this.props.height / 2;
        const radius = this.getRadius();

        const divisions = [[12, 0.75, i => mod(180 - 360 / 12 * i, 360)],
            [36, 0.5, i => ""],
            [144, 0.25, i => ""]];

        return <div className="compass" style={{width: this.props.width + "px", height: this.props.height + "px", color: this.colors.primary, backgroundColor: this.colors.background}}>
            <NumberDisplay 
                className="number" 
                value={this.state.heading}
                suffix="°" 
                unit="T" 
                width={this.props.width}
                height={this.props.height / 4}
                upperBound={360} 
                decimalPlaces={1} 
                fontSize={this.props.width / 4}
                legend="Suunta"
            />
            <canvas ref="canvas_static" className="background" width={this.props.width} height={this.props.height } />
            {/*<canvas ref="canvas" className="compassRose" width={this.props.width} height={this.props.height } style={{transform: "rotate(" + -this.state.heading + "deg)"}} />*/}
            {/*<canvas ref="canvas_overlay" className="compassRose" width={this.props.width} height={this.props.height } style={{transform: "rotate(" + -this.state.heading + "deg)"}} />*/}

            <svg className={"compassRose"} width={this.props.width} height={this.props.height} style={{transform: "rotate(" + -this.state.heading + "deg)"}}>
                <circle
                    cx={centerX}
                    cy={centerY}
                    r={radius}
                    fill={this.colors.background}
                    stroke={this.colors.primary}
                    strokeWidth={2}
                />
                <g fill={this.colors.primary} stroke={this.colors.primary}>
                    {divisions.map((division) => {
                        return new Svghelpers()
                            .drawDivision(centerX, centerY,
                                radius, -division[1] * this.props.width * 0.1,
                                division[0], radius * 0.15, i => 2 * Math.PI / division[0] * i, division[2], true)
                        })
                    }
                </g>
            </svg>
        </div>
    }


}

export default Compass