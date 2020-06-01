import React from "react";
import Gauge from "./Gauge";

class GaugeContainer extends React.Component {
    render () {
        let zones = {
            normal: [0, 0.3],
            alert: [0.3, 0.5],
            warn: [0.5, 0.7],
            alarm: [0.7, 0.9],
            emergency: [0.9, 1]
        }

        return <Gauge zones={zones} width={this.props.width} height={this.props.height} />
    }
}

export default GaugeContainer;