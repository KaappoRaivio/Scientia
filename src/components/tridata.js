import React from 'react';

import NumberDisplay from "./numberdisplay"
import "./tridata.css"

class Tridata extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            "environment.depth.belowTransducer": -1,
            "navigation.speedThroughWater": -1,
            "performance.velocityMadeGood": "--"
        };

        this.onMessage = (message) => {
            let path = message.values[0].path;

            // console.log(path, message.values[0].value)
            // console.log(this.state)

            if (path in this.state) {
                this.setState({
                    [path]: message.values[0].value
                })
            } else {
            }

        };

        this.props.subscribe(["depth.belowTransducer", "navigation.speedThroughWater", "performance.velocityMadeGood"], this.onMessage)
    }

    render () {
        let divider = 3;
        
        return <div style={{ width: this.props.width + "px", height: this.props.height + "px" }}>
            <NumberDisplay
                value={this.state["environment.depth.belowTransducer"]}
                suffix=""
                unit="metriä"
                width={this.props.width}
                height={this.props.height / divider}
                upperBound={99}
                decimalPlaces={1}
                fontSize={this.props.width / 4}
                legend="Syvyys"
            />
            <NumberDisplay
                value={this.state["navigation.speedThroughWater"] * 3.6 / 1.852}
                suffix=""
                unit="solmua"
                width={this.props.width}
                height={this.props.height / divider}
                upperBound={99}
                decimalPlaces={1}
                fontSize={this.props.width / 4}
                legend="Nopeus"
            />
            <NumberDisplay
                value={this.state["performance.velocityMadeGood"] * 3.6 / 1.852}
                suffix=""
                unit="solmua"
                width={this.props.width}
                height={this.props.height / divider}
                upperBound={99}
                decimalPlaces={1}
                fontSize={this.props.width / 4}
                legend="VMG"
            />
        </div>
    }
}

export default Tridata;