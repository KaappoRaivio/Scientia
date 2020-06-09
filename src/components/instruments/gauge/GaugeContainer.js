import React from "react";
import Gauge from "./Gauge";

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
        }, 1000)
    }

    render () {
        const divisions = [
            {numberOfLines: 12, lineLength: 0.1 * 1, textProvider: i => "", angleProvider: i => 2 * Math.PI / 12 * i},
            {numberOfLines: 36, lineLength: 0.1 * 0.5, textProvider: i => "", angleProvider: i => 2 * Math.PI / 36 * i},
            {numberOfLines: 144, lineLength: 0.1 * 0.25, textProvider: i => "", angleProvider: i => 2 * Math.PI / 144 * i},
        ]
        let zones = {
            normal: [0, 4],
            alert: [4, 6.5],
            warn: [6.5, 8],
            alarm: [8, 9],
            emergency: [9, 10]
        }

        return <Gauge
            zones={zones}
            width={this.props.width}
            height={this.props.height}
            colors={this.props.colors}
            darkMode={this.props.darkMode}
            divisions={divisions}
            displayScale={{"upper": 10, "lower": 0}}
            value={this.state.value}
            animate={this.props.animate}
            unit={"kts/s²"}
            label={"Acceleration"}
            suffix={""}
            decimalPlaces={0}
        />
    }
}

export default GaugeContainer;