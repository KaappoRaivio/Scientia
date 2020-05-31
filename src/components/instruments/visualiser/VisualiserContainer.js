import * as React from "react";

import "./visualiser.css"
import Visualiser from "./Visualiser";

class  VisualiserContainer extends React.Component {
    constructor(props) {
        super(props);

        let data = /*[...Array(1000).keys()].map((_, index) => ({x: index, y: index}))*/ [{x: 0, y: 0}];
        console.log(data);
        this.state = {
            counter: 0,
            data,
            trendData: [{x: 0, y: 0}],
            yDomain: [0, 0]
        };

        if (this.props.convert) {
            this.converter = this.props.convert
        } else {
            this.converter = x => x;
        }
    }

    subscribe () {
        const onMessage = (message) => {
            let value = message.values[0];
            this.addData(value.value);
        }

        this.props.subscribe([this.props.path], onMessage)
    }

    componentDidMount() {
        this.subscribe();
    }

    addData (dataPoint) {
        let trend = this.computeTrendDataPoint(this.state.data)

        this.setState(({data, trendData}) => {
            return {
                data: this.concatData(data, {x: this.getLatestX(), y: this.converter(dataPoint)}),

                trendData: this.concatData(trendData, trend),

            }
        });

    }

    getLatestX () {
        return this.state.data[this.state.data.length - 1].x + 1;
    }

    concatData(data, dataPoint) {
        return data.concat(
            dataPoint
        );
    }


    computeTrendDataPoint (data) {
        let dataPoints = data.slice(Math.max(data.length - this.props.trendlinePeriod, 0), data.length);
        if (!dataPoints.length) {
            return {x: 0, y: 0}
        }

        let lastPoint = this.state.data[this.state.data.length - 1];

        let x = lastPoint.x - Math.trunc(this.props.trendlinePeriod / 2) - 1;
        let y = dataPoints.map(a => a.y).reduce ((a, b) => a + b) / dataPoints.length;

        if (x < 0) {
            return {x: 0, y: 0}
        } else {
            return {x, y}
        }
    }

    render () {

        return <Visualiser
            legend={this.props.legend}
            unit={this.props.unit}
            ranges={this.props.ranges}

            animate={this.props.animate}
            colors={this.props.colors}

            width={this.props.width}
            height={this.props.height}

            data={this.state.data}
            trendData={this.state.trendData}
            trendlinePeriod={this.props.trendlinePeriod}
            numberOfPointsToShow={this.props.numberOfPointsToShow}
            negate={this.props.negate}
        />
    }
}

export default VisualiserContainer