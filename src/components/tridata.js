import React from 'react';

import NumberDisplay from "./numberdisplay"
import "./tridata.css"

class Tridata extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            "environment.depth.belowTransducer": -1,
            "navigation.speedOverGround": -1,
            "performance.velocityMadeGood": -1
        }

        this.onMessage = (message) => {
            let path = message.values[0].path;

            if (path in this.state && message.source.label === "nmeaFromFile") {
                this.setState({
                    [path]: message.values[0].value
                })
            } else {
                // console.log(path)
            }

        }

        this.props.subscribe(["depth.belowTransducer", "navigation.speedOverGround", "performance.velocityMadeGood"], this.onMessage)
    }

    render () {
        let divider = 3.075;
        
        return <div className="container" style={{ width: this.props.width + "px", height: this.props.height + "px" }}>
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
                value={this.state["navigation.speedOverGround"] * 3.6 / 1.852}
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