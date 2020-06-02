import React from "react";
import Gauge from "./Gauge";
import {mod} from "mathjs";

class GaugeContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            counter: 0,
            value: 0
        }
    }

    componentDidMount() {
        setInterval(() => {
            this.setState(({value, counter}) => ({
                counter: counter + 1,
                value: (Math.abs(Math.sin(counter / 10))) * 10
            }));
        }, 500)
    }

    render () {
        const divisions = [
            {numberOfDivisions: 12, lineLength: 0.75, textProvider: i => ""},
            {numberOfDivisions: 36, lineLength: 0.5, textProvider: i => ""},
            {numberOfDivisions: 144, lineLength: 0.25, textProvider: i => ""},
        ]
        let zones = {
            normal: [0, 0.3],
            alert: [0.3, 0.5],
            warn: [0.5, 0.7],
            alarm: [0.7, 0.9],
            emergency: [0.9, 1]
        }

        return <Gauge
            zones={zones}
            width={this.props.width}
            height={this.props.height}
            colors={this.props.colors}
            divisions={divisions}
            upperBound={10}
            value={this.state.value}
        />
    }
}

export default GaugeContainer;