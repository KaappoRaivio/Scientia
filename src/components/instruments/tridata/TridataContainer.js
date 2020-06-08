import React from 'react';

import "./tridata.css"
import Tridata from "./Tridata";

const translatePath = {
    "environment.depth.belowTransducer": "depth",
    "navigation.speedThroughWater": "speed",
    "performance.velocityMadeGood": "vmg"
}

class TridataContainer extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            depth: {
                value: null,
                units: " ",
                zones: []
            },
            speed: {
                value: null,
                units: " ",
                zones: []
            },
            vmg: {
                value: null,
                units: " ",
                zones: []
            }
        };
    }

    componentDidMount() {
        const onDelta = (message) => {
            let path = message.values[0].path;

            this.setState(oldState => {
                const dataKeyPath = translatePath[path];
                return {
                    [dataKeyPath]: {
                        value: message.values[0].value,
                        units: oldState[dataKeyPath].units,
                        zones: oldState[dataKeyPath].zones
                    }
                }
            })
        };

        const onMetadata = (data, path) => {
            console.log(data, path)

            this.setState(oldState => {
                const dataKeyPath = translatePath[path];
                return {
                    [dataKeyPath]: {
                        value: oldState[dataKeyPath].value,
                        units: data.units,
                        zones: data.zones || []
                    }
                }
            })

            console.log(this.state)
        }

        this.props.subscribe([/environment.depth.belowTransducer/, /navigation.speedThroughWater/, /performance.velocityMadeGood/], onDelta, onMetadata)
    }

    render () {
        // TODO 24.5.2020: Migrate data acquisition into parent
        const values = [
            {
                value: this.state.depth.value,
                suffix: "", unit: this.state.depth.units, legend: "Depth",
                upperBound: 99, decimalPlaces: 1,
                conversion: 1
            },
            {
                value: this.state.speed.value,
                suffix: "", unit: this.state.speed.units, legend: "Speed",
                upperBound: 99, decimalPlaces: 1,
                conversion: 1
                // conversion: 3.6 / 1.852
            },
            {
                value: this.state.vmg,
                suffix: "", unit: this.state.vmg.units, legend: "VMG",
                upperBound: 990, decimalPlaces: 1,
                conversion: 1
                // conversion: 3.6 / 1.852
            },
            // {
            //     value: this.state["performance.velocityMadeGood"],
            //     suffix: "", unit: "knots", legend: "VMG",
            //     upperBound: 990, decimalPlaces: 1,
            //     conversion: 3.6 / 1.852
            // }
        ]
        return <Tridata
            width={this.props.width}
            height={this.props.height}
            values={values}
            colors={this.props.colors}/>
    }
}

export default TridataContainer;