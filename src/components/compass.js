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
    }

    getCircleRadius (canvasWidth, offsetY) {
        return Math.sqrt((canvasWidth / 2) ** 2 + offsetY ** 2) / 1.05
    }

    getRadius () {
        return Math.max(this.props.width / 2 - 2, 0)
    }

    getCenter () {
        return {x: this.props.width / 2, y: this.props.height / 2};
    }

    getCompassLineMaxLength ()  {
        return this.props.width / 2 / 10;
    }

    componentDidMount() {
        this.subscribe();
    }

    subscribe () {
        this.onMessage = (message) => {
            const extracted = message.values[0].value;
            this.setState({heading: extracted / Math.PI * 180});
        };
        this.props.subscribe([/navigation\.courseOverGroundTrue/], this.onMessage);
    }

    render () {
        const center = this.getCenter();
        const radius = this.getRadius();

        const divisions = [
            [12, 0.75, i => mod(180 - 360 / 12 * i, 360)],
            [36, 0.5, i => ""],
            [144, 0.25, i => ""]
        ];

        const colors = this.props.colors;

        const parentStyle = {
            width: this.props.width + "px",
            height: this.props.height + "px",
            color: colors.primary,
            backgroundColor: colors.background
        };

        return <div className="compass" style={parentStyle}>
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

            <svg className="compassRose" width={this.props.width} height={this.props.height} style={{transform: `rotate(${-this.state.heading}deg)`}}>
                <circle
                    cx={center.x}
                    cy={center.y}
                    r={radius}
                    fill={colors.background}
                    stroke={colors.primary}
                    strokeWidth={2}
                />
                <g fill={colors.primary} stroke={colors.primary}>
                    {divisions.map((division) => {
                        return new Svghelpers()
                            .drawDivision(center.x, center.y,
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