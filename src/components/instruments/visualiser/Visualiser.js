import * as React from "react";
import {HorizontalGridLines, LineSeries, XAxis, XYPlot, YAxis} from "react-vis";

import "./visualiser.css"

class  Visualiser extends React.Component {
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

    addData (data) {
        let trend = this.computeTrendDataPoint()

        this.setState(oldState => {
            return {
                data: oldState.data.concat({
                    x: oldState.counter,
                    y: isNaN(this.converter(data)) ? 0 : this.converter(data)
                }),

                trendData: oldState.trendData.concat(trend),

                counter: oldState.counter + 1,
                yDomain: this.getYDomain()
            }
        });

    }

    computeTrendDataPoint () {
        let dataPoints = this.state.data.slice(Math.max(this.state.data.length - this.props.trendlinePeriod, 0), this.state.data.length);
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
        const colors = this.props.colors;

        const lineStyle = {stroke: colors.primary, backgroundColor: colors.background};

        return (
            <div className="parent with-shadow" style={{ color: colors.primary, backgroundColor: colors.background}}>
                <div className="legend" style={{height: this.props.height * 0.1}}>
                    {this.props.legend}, {this.props.unit}
                </div>
                <XYPlot className="plot"
                        animation={this.props.animate}
                        width={this.props.width}
                        height={this.props.height * 0.9 * 0.94}
                        xDomain={[this.state.counter - this.props.numberOfPointsToShow, this.state.counter]}
                        yDomain={this.state.yDomain}
                        getY={y => this.props.negate? -y.y : y.y}
                        >
                        <HorizontalGridLines
                            style={{...lineStyle}}
                        />
                        <LineSeries
                            data={this.state.data}
                            style={{...lineStyle, strokeDasharray: "10, 10", strokeWidth: 1}}
                        />

                        {this.props.trendline ? <LineSeries
                            data={this.state.trendData}
                            style={{...lineStyle, strokeWidth: 2}}
                        /> : <span />}

                        <XAxis
                            xDomain={[this.state.counter - this.props.numberOfPointsToShow, this.state.counter]}
                            hideTicks
                            orientation={"top"}
                            style={lineStyle}

                        />
                        <YAxis
                            yDomain={this.state.yDomain}
                            style={lineStyle}
                        />
                </XYPlot>
            </div>
        )
    }
}

export default Visualiser