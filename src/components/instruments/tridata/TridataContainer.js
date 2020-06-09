import React from 'react';

import "./tridata.css"
import Tridata from "./Tridata";
import _ from "underscore";

const translatePath = {
    "environment.depth.belowTransducer": "depth",
    "navigation.speedThroughWater": "speed",
    "performance.velocityMadeGood": "vmg"
}

const valueSkeleton = {
    value: null,
    units: null,
    zones: [],
    displayScale: {"upper": null, "lower": null, "type": "linear"},
    decimalPlaces: 1
};

class TridataContainer extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            depth: {...valueSkeleton, label: "Depth"},
            speed: {...valueSkeleton, label: "Speed"},
            vmg: {...valueSkeleton, label: "VMG"}
        };
    }

    componentDidMount() {
        const onDelta = (message) => {
            let path = message.values[0].path;

            this.setState(oldState => {
                const dataKeyPath = translatePath[path];
                let interestingKey = oldState[dataKeyPath];
                return {
                    [dataKeyPath]: {
                        value: message.values[0].value,
                        units: interestingKey.units,
                        zones: interestingKey.zones,
                        displayScale: interestingKey.displayScale,
                        label: interestingKey.label,
                        decimalPlaces: interestingKey.decimalPlaces,
                    }
                }
            })
        };

        const onMetadata = (data, path) => {
            this.setState(oldState => {
                const dataKeyPath = translatePath[path];
                let interestingKey = oldState[dataKeyPath];

                return {

                    [dataKeyPath]: {
                        value: interestingKey.value,
                        units: data.units, // Data.units is always nonnull per the Signalk spec // 20200608
                        zones: data.zones || interestingKey.zones,
                        displayScale: data.displayScale || interestingKey.displayScale,
                        label: interestingKey.label,
                        decimalPlaces: interestingKey.decimalPlaces,
                    }

                }
            })

            console.log(this.state)
        }

        this.props.subscribe([/environment.depth.belowTransducer/,
            /navigation.speedThroughWater/,
            /performance.velocityMadeGood/
            ],
            onDelta, onMetadata)
    }

    render () {
        // TODO 24.5.2020: Migrate data acquisition into parent
        // const values = [
        //     {
        //         value: this.state.depth.value,
        //         suffix: "", unit: this.state.depth.units, legend: "Depth",
        //         upperBound: 99, decimalPlaces: 1,
        //         conversion: 1
        //     },
        //     {
        //         value: this.state.speed.value,
        //         suffix: "", unit: this.state.speed.units, legend: "Speed",
        //         upperBound: 99, decimalPlaces: 1,
        //         conversion: 1
        //         // conversion: 3.6 / 1.852
        //     },
        //     {
        //         value: this.state.vmg,
        //         suffix: "", unit: this.state.vmg.units, legend: "VMG",
        //         upperBound: 990, decimalPlaces: 1,
        //         conversion: 1
        //         // conversion: 3.6 / 1.852
        //     },
            // {
            //     value: this.state["performance.velocityMadeGood"],
            //     suffix: "", unit: "knots", legend: "VMG",
            //     upperBound: 990, decimalPlaces: 1,
            //     conversion: 3.6 / 1.852
            // }
        // ]
        const values = Object.keys(this.state).map(key => this.state[key]);
            return <Tridata
                width={this.props.width}
                height={this.props.height}
                values={values}
                colors={this.props.colors}/>
        // }
    }
}

export default TridataContainer;