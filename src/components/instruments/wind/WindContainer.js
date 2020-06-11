import React from "react";
import Wind from "./Wind";

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

            displayScale: {lower: 0, upper: 20, type: "power", "power": 2}
        }

        this.divisions = [
            {
                numberOfLines: 12,
                lineLength: 0.15,
                textProvider: i => Math.abs(180 - (2 * Math.PI / 12 * i / Math.PI * 180).toFixed(0)),
                angleProvider: i => 2 * Math.PI / 12 * i,
                fontSize: "80%"
            },
            {numberOfLines: 36, lineLength: 0.1, textProvider: i => "", angleProvider: i => 2 * Math.PI / 36 * i},
            {numberOfLines: 144, lineLength: 0.05, textProvider: i => "", angleProvider: i => 2 * Math.PI / 144 * i},
        ]
    }

    componentDidMount() {
        this.subscribe()
    }

    subscribe() {
        this.counter = 1;
        const onDelta = (message) => {
            let path = message.values[0].path.split(".")[2];

            if (path in this.state) {
                this.setState({
                    [path]: message.values[0].value
                })
            }
        };

        const onMetadata = (meta, path) => {
            console.log(meta, path)
            if (path === "environment.wind.speedTrue") {
                this.setState({displayScale: meta.displayScale})
            }
        }
        this.props.subscribe(["environment.wind.speedTrue", "environment.wind.speedApparent",
            "environment.wind.angleTrueWater", "environment.wind.angleApparent"], onDelta, onMetadata)
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
            animate={this.props.animate}
            displayScale={this.state.displayScale}
        />
    }
}

export default WindContainer;