import React from "react";
import Gauge from "./Gauge";
// import {camelCaseToSentenceCase, valueSkeleton} from "../DataStructures";
import { getByStringPath, valueSkeleton } from "delta-processor";

import PropTypes from "prop-types";


class GaugeContainer extends React.Component {
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,

        animate: PropTypes.bool,
        colors: PropTypes.object.isRequired,
        darkMode: PropTypes.bool.isRequired,
    }

    // componentDidMount() {
    //     const onDelta = (message) => {
    //         let path = message.values[0].path;
    //
    //         this.setState(oldState => {
    //             let interestingKey = oldState[path];
    //             return {
    //                 [path]: {
    //                     value: message.values[0].value,
    //                     units: interestingKey.units,
    //                     zones: interestingKey.zones,
    //                     displayScale: interestingKey.displayScale,
    //                     label: interestingKey.label,
    //                     decimalPlaces: interestingKey.decimalPlaces,
    //                 }
    //             }
    //         })
    //     };
    //
    //     const onMetadata = (data, path) => {
    //         // // console.log(data, path)
    //
    //         this.setState(oldState => {
    //             let interestingKey = oldState[path];
    //             // console.log("asd", interestingKey, data, data.units);
    //             return {
    //                 [path]: {
    //                     value: interestingKey.value,
    //                     units: data.units, // Data.units is always nonnull per the Signalk spec // 20200608
    //                     zones: data.zones || interestingKey.zones,
    //                     displayScale: data.displayScale || interestingKey.displayScale,
    //                     label: interestingKey.label,
    //                     decimalPlaces: interestingKey.decimalPlaces,
    //                 }
    //
    //             }
    //         })
    //     }
    //
    //     this.props.subscribe([this.props.path], onDelta, onMetadata)
    // }

    render () {
        const {path, width, animate, height, colors, darkMode, data} = this.props;
        // const dataPath = this.state[path];
        // console.log("asd", dataPath)
        const value = getByStringPath(path, data.vessels.self) || valueSkeleton;

        return <Gauge
            zones={value.meta.zones}
            width={width}
            height={height}
            colors={colors}
            darkMode={darkMode}
            displayScale={value.meta.displayScale}
            value={value.value}
            animate={animate}
            units={value.meta.units}
            label={value.meta.displayName}
            suffix={""}
            decimalPlaces={1}
        />
    }
}

export default GaugeContainer;