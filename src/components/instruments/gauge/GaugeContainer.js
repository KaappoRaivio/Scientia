import React from "react";
import Gauge from "./Gauge";
import {camelCaseToSentenceCase, valueSkeleton} from "../DataStructures";

import PropTypes from "prop-types";


class GaugeContainer extends React.Component {
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,

        animate: PropTypes.bool,
        colors: PropTypes.object.isRequired,
        darkMode: PropTypes.bool.isRequired,
    }
    // const {path, width, animate, height, colors, darkMode} = this.props;

    constructor(props) {
        super(props);

        let state = {};
        state[props.path] = {...valueSkeleton, label: camelCaseToSentenceCase(props.path.split(".").slice(1).join(", "))}
        this.state = state;
    }

    componentDidMount() {
        const onDelta = (message) => {
            let path = message.values[0].path;

            this.setState(oldState => {
                let interestingKey = oldState[path];
                return {
                    [path]: {
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
            // // console.log(data, path)

            this.setState(oldState => {
                let interestingKey = oldState[path];
                // console.log("asd", interestingKey, data, data.units);
                return {
                    [path]: {
                        value: interestingKey.value,
                        units: data.units, // Data.units is always nonnull per the Signalk spec // 20200608
                        zones: data.zones || interestingKey.zones,
                        displayScale: data.displayScale || interestingKey.displayScale,
                        label: interestingKey.label,
                        decimalPlaces: interestingKey.decimalPlaces,
                    }

                }
            })
        }

        this.props.subscribe([this.props.path], onDelta, onMetadata)
    }

    render () {
        const {path, width, animate, height, colors, darkMode} = this.props;
        const dataPath = this.state[path];
        // console.log("asd", dataPath)

        return <Gauge
            zones={dataPath.zones}
            width={width}
            height={height}
            colors={colors}
            darkMode={darkMode}
            displayScale={dataPath.displayScale}
            value={dataPath.value}
            animate={animate}
            units={dataPath.units}
            label={dataPath.label}
            suffix={""}
            decimalPlaces={1}
        />
    }
}

export default GaugeContainer;