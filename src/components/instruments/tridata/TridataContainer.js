import React from 'react';

import NumberDisplay from "../../numberdisplay"
import "./tridata.css"
import Tridata from "./Tridata";

class TridataContainer extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            "environment.depth.belowTransducer": "--",
            "navigation.speedThroughWater": "--",
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

        this.props.subscribe([/depth.belowTransducer/, /navigation.speedThroughWater/, /performance.velocityMadeGood/], this.onMessage)
    }

    render () {
        // TODO 24.5.2020: Migrate data acquisition into parent
        const values = [
            {
                value: this.state["environment.depth.belowTransducer"],
                suffix: "", unit: "metriä", legend: "Syvyys",
                upperBound: 99, decimalPlaces: 1,
                conversion: 1
            },
            {
                value: this.state["navigation.speedThroughWater"],
                suffix: "", unit: "solmua", legend: "Nopeus",
                upperBound: 99, decimalPlaces: 1,
                conversion: 3.6 / 1.852
            },
            {
                value: this.state["performance.velocityMadeGood"],
                suffix: "", unit: "solmua", legend: "VMG",
                upperBound: 990, decimalPlaces: 1,
                conversion: 3.6 / 1.852
            },
        ]
        return <Tridata
            width={this.props.width}
            height={this.props.height}
            values={values}
            colors={this.props.colors}/>
    }
}

export default TridataContainer;