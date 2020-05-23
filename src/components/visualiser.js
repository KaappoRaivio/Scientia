import * as React from "react";
import {HorizontalGridLines, LineSeries, XAxis, XYPlot, YAxis} from "react-vis";

import "./visualiser.css"

class  Visualiser extends React.Component {
        constructor(props) {
        super(props);

        this.state = {
            counter: 0,
            data: [
              // {x: 0, y: 0},
            ],
            trendData: [
                // {x: 0, y: 0}
            ],

            yDomain: [0, 0]
        };

        if (this.props.convert) {
            this.converter = this.props.convert
        } else {
            this.converter = x => x;
        }

        this.subscribe();
        this.setColors()
    }

    subscribe () {
            this.props.subscribe([this.props.path], this.onMessage.bind(this))
    }

    onMessage (message) {
        let value = message.values[0];
        this.addData(value.value);

    }

    setColors () {
        if (this.props.darkMode) {
            this.colors = {
                primary: "#f00",
                background: "#000"
            }
        } else {
            this.colors = {
                primary: "#777",
                background: "#fff"
            }
        }

    }

    addData (data) {
        let trend = this.computeTrendDataPoint()

        this.setState(oldState => {
            return {
                data: oldState.data.concat({
                    x: oldState.counter,
                    y: this.converter(data)
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
            return {x: null, y: null}
        }

        let y = dataPoints.map(a => a.y).reduce ((a, b) => a + b) / dataPoints.length;
        let x = this.state.data[this.state.data.length - 1].x;

        return {x: x, y: y}
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.setColors()
    }

    render () {
        return (
            <div className="parent with-shadow" style={{ color: this.colors.primary, backgroundColor: this.colors.background}}>
                    <div className="legend" style={{height: this.props.height * 0.1}}>
                        {this.props.legend}, {this.props.unit}
                    </div>
                    <XYPlot className="plot"
                        animation={true}
                        width={this.props.width}
                        height={this.props.height * 0.9 * 0.94}
                        xDomain={[this.state.counter - this.props.numberOfPointsToShow, this.state.counter]}
                        yDomain={this.state.yDomain}
                        getY={y => this.props.negate? -y.y : y.y}
                        // style={{fill: this.colors.primary, backgroundColor: this.colors.background}}
                        >
                        <HorizontalGridLines
                            style={{stroke: this.colors.primary, backgroundColor: this.colors.background}}
                        />
                        <LineSeries
                            data={this.state.data}
                            style={{stroke: this.colors.primary, backgroundColor: this.colors.background}}
                        />

                        {this.props.trendline ? <LineSeries
                            data={this.state.trendData}
                            style={{stroke: this.colors.primary, backgroundColor: this.colors.background, strokeDasharray: "10, 10"}}
                        /> : <span />}

                        <XAxis
                            xDomain={[this.state.counter - this.props.numberOfPointsToShow, this.state.counter]}
                            hideTicks
                            orientation={"top"}
                            style={{stroke: this.colors.primary, backgroundColor: this.colors.background}}

                        />
                        <YAxis
                            yDomain={this.state.yDomain}
                            style={{fill: this.colors.primary, stroke: this.colors.primary, backgroundColor: this.colors.background}}
                        />
                </XYPlot>
            </div>
        )
    }
}

export default Visualiser