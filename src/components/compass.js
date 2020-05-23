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

        this.setColors();
    }

    setColors () {
        if (this.props.darkMode) {
            this.colors = {
                primary: "#f00",
                background: "#000"
            }
        } else {
            this.colors = {
                primary: "#777",
                background: "#fff",
            }
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
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.setColors()
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

    drawBackground () {
        const ctx = this.refs.canvas_static.getContext("2d");
        ctx.fillRect(this.props.width / 2 - 1.5, this.props.height / 2  - 10.5, 2, 10);
        ctx.stroke()

    }

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
                                division[0], radius * 0.15,
                                i => 2 * Math.PI / division[0] * i, division[2],
                                true)
                        })
                    }
                </g>
            </svg>
        </div>
    }


}

export default Compass