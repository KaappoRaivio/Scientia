import React from 'react';

import "./tridata.css"
import Tridata from "./Tridata";
import {camelCaseToSentenceCase, valueSkeleton} from "../DataStructures";
import { getByStringPath } from "delta-processor";

class TridataContainer extends React.Component {
    constructor (props) {
        super(props);

        // let state = {};
        // props.paths.forEach(path => state[path] = {...valueSkeleton, label: })
        // this.state = state;
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
    //         this.setState(oldState => {
    //             let interestingKey = oldState[path];
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
    //     this.props.subscribe(this.props.paths, onDelta, onMetadata)
    // }

    render () {
        // const values = Object.keys(this.state).map(key => this.state[key]);
        // const data = this.props.data
        // console.log(this.props, this.props.paths)
        const values = this.props.paths.map(path => getByStringPath(path, this.props.data.vessels.self) || {meta: {displayScale: {}}});
        // console.log(values)

        return <Tridata
                width={this.props.width}
                height={this.props.height}
                values={values}
                colors={this.props.colors}
                darkMode={this.props.darkMode}
            />
        return <div></div>
    }
}

export default TridataContainer;