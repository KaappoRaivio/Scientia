import React from 'react';

import NumberDisplay from "./numberdisplay.js"
import Needle from "./needle"
import Svghelpers from "./misc/svghelpers";

import "./wind.css"


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

        const darkMode = true;
        if (darkMode) {
            this.colors = {
                primary: "#f00",
                background: "#000",
                closeHaulRight: "rgba(0, 200, 0)",
                closeHaulLeft: "rgba(255, 150, 125)",

                angleTrue: "rgb(0, 50, 150)",
                angleApparent: "rgb(0, 50, 220)",
            }
        } else {
            this.colors = {
                primary: "#777",
                background: "#fff",

                closeHaulRight: "rgba(0, 200, 0, 0.75)",
                closeHaulLeft: "rgba(255, 150, 125, 0.75)",

                angleTrue: "rgb(0, 50, 150)",
                angleApparent: "rgb(0, 50, 220)",
            }
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
        this.props.subscribe([/environment\.wind\..+/], this.onMessage.bind(this))
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
    }



    render() {
        const divisions = [
            {numberOfDivisions: 12,  lineLength: 0.75, textProvider: i => Math.abs(180 - (2 * Math.PI / 12 * i / Math.PI * 180).toFixed(0))},
            {numberOfDivisions: 36,  lineLength: 0.5,  textProvider: i => ""},
            {numberOfDivisions: 144, lineLength: 0.25, textProvider: i => ""},
        ]

        const centerX = this.props.width / 2;
        const centerY = this.props.height / 2;
        const radius = this.getRadius();
        const radiusPercent = this.getRadius() / (this.props.width / 2) * 100 / 2;
        const helper = new Svghelpers();

        return (
            <div style={{ width: this.props.width + "px", height: this.props.height + "px", background: this.colors.background, color: this.colors.primary }}>
                <div className="layerCentered">
                    <NumberDisplay
                        value={this.state.speedApparent * 3.6 / 1.852}
                        suffix=""
                        unit="kts"
                        width={this.props.width / 2}
                        height={this.props.height * 0.25}
                        upperBound={99}
                        decimalPlaces={1}
                        fontSize={this.props.width / 6}
                        legend="Tuulen nopeus (T)"
                    />
                </div>

                <Needle angle={this.state.angleApparent / Math.PI * 180} radius={radiusPercent} color={this.colors.angleApparent}/>
                <Needle angle={this.state.angleTrueWater / Math.PI * 180} radius={radiusPercent} color={this.colors.angleTrue}/>

                <svg width={this.props.width} height={this.props.height}>
                    <circle
                        cx={centerX}
                        cy={centerY}
                        r={radius}
                        fill={this.colors.background}
                        stroke={this.colors.primary}
                        strokeWidth={2}
                    />

                    <g fill={this.colors.closeHaulRight}>
                        {helper.getSector(centerX, centerY, radius, this.state.closeHaulAngle, this.colors.background)}
                    </g>
                    <g fill={this.colors.closeHaulLeft}>
                        {helper.getSector(centerX, centerY, radius, -this.state.closeHaulAngle, this.colors.background)}
                    </g>
                    <g stroke={this.colors.primary} fill={this.colors.primary}>
                        {divisions.map((division) => {
                            return helper
                                    .drawDivision(centerX, centerY,
                                        radius,
                                        -division.lineLength * this.props.width * 0.1,
                                        division.numberOfDivisions,
                                        radius * 0.15,
                                        i => 2 * Math.PI / division.numberOfDivisions * i,
                                        division.textProvider,
                                        false)
                            })
                        }
                    </g>

                </svg>
            </div>
        )
    }
}

export default Wind