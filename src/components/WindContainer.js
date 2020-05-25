import React from "react";
import Wind from "./wind";

class WindContainer extends React.Component {
    constructor(props) {
        super(props);
        this.data = {};

        this.state = {
            closeHaulAngle: 41,

            angleTrueWater: null,
            angleApparent: null,
            speedTrue: null,
            speedApparent: null,
        }

        this.subscribe()

        this.divisions = [
            {
                numberOfDivisions: 12,
                lineLength: 0.75,
                textProvider: i => Math.abs(180 - (2 * Math.PI / 12 * i / Math.PI * 180).toFixed(0))
            },
            {numberOfDivisions: 36, lineLength: 0.5, textProvider: i => ""},
            {numberOfDivisions: 144, lineLength: 0.25, textProvider: i => ""},
        ]
    }

    subscribe() {
        this.counter = 1;
        const onMessage = (message) => {
            let path = message.values[0].path.split(".")[2];

            if (path in this.state) {
                this.setState({
                    [path]: message.values[0].value
                })
            }
        };
        this.props.subscribe([/environment\.wind\..+/], onMessage)
    }

    render () {
        let speed, speedQuality;
        if (this.state.speedTrueWater !== null) {
            speed = this.state.speedTrue;
            speedQuality = "T";
        } else {
            speed = this.state.speedApparent;
            speedQuality = "A";
        }

        return <Wind
            width={this.props.width} height={this.props.height}
            angleApparent={this.state.angleApparent}
            angleTrue={this.state.angleTrueWater}
            speed={speed}
            speedQuality={speedQuality}
            closeHaulAngle={this.state.closeHaulAngle}
            colors={this.props.colors} darkMode={this.props.darkMode}
            divisions={this.divisions}
        />
    }
}

export default WindContainer;