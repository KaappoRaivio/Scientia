import * as React from "react";
import {HorizontalGridLines, LineSeries, XAxis, XYPlot, YAxis} from "react-vis";

import "./visualiser.css"
import Visualiser from "./Visualiser";

class  VisualiserContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            counter: 0,
            data: [],
            trendData: [],
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
        console.log(trend)

        this.setState(({counter, data, trendData}) => {
            return {
                data: this.concatData(data, {x: counter, y: dataPoint}),

                trendData: this.concatData(trendData, trend),

                counter: counter + 1,
                yDomain: this.getYDomain()
            }
        });

    }

    concatData(data,  dataPoint) {
        console.log(dataPoint)
        return this.truncate(data.concat(
            dataPoint
        ));
    }

    truncate(data) {
        if (data.length > this.props.numberOfPointsToShow * 2) {
            while (data.length > this.props.numberOfPointsToShow + 1) {
                data.shift();
            }
            console.log(data)
        }

        return data;
    }

    computeTrendDataPoint (data) {
        let dataPoints = data.slice(Math.max(data.length - this.props.trendlinePeriod, 0), data.length);
        if (!dataPoints.length) {
            return {x: 0, y: 0}
        }

        let x = this.state.data.length - Math.trunc(this.props.trendlinePeriod / 2) - 1;
        let y = dataPoints.map(a => a.y).reduce ((a, b) => a + b) / dataPoints.length;

        if (x < 0) {
            return {x: 0, y: 0}
        } else {
            return {x, y}
        }
    }

    getYDomain () {
        let data = this.state.data.slice(Math.max(this.state.data.length - this.props.numberOfPointsToShow, 0), this.state.data.length);

        let absMax = Math.max(...data.map(item => item.y).map(Math.abs));

        var closest = this.props.ranges.reduce((accumulator, current) => {
            if (current > absMax && accumulator < absMax) {
                return current;
            } else {
                return accumulator;
            }
        });

        if (this.props.negate) {
            return [-closest, 0];
        } else {
            return [0, closest];
        }
    }

    render () {
        console.log(this.state)

        return <Visualiser
            animate={this.props.animate}
            colors={this.props.colors}
            legend={this.props.legend}
            unit={this.props.unit}
            width={this.props.width}
            height={this.props.height}
            data={this.state.data}
            counter={this.state.counter}
            numberOfPointsToShow={this.props.numberOfPointsToShow}
            yDomain={this.state.yDomain}
            trendline={this.props.trendline}
            trendlinePeriod={this.props.trendlinePeriod}
            trendData={this.state.trendData}
        />
    }
}

export default VisualiserContainer