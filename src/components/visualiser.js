import * as React from "react";
import {ChartLabel, HorizontalGridLines, LineSeries, XAxis, XYPlot, YAxis} from "react-vis";

import "./visualiser.css"

class  Visualiser extends React.Component {
        constructor(props) {
        super(props);

        this.state = {
            counter: 0,
            data: [
              {x: 0, y: 0},
            ],
            yDomain: [0, 0]
        };

        if (this.props.convert) {
            this.converter = this.props.convert
        } else {
            this.converter = x => x;
        }

    }

    componentDidMount() {
        this.subscribe();
    }

    subscribe () {
            this.props.subscribe([this.props.path], this.onMessage.bind(this))
    }

    onMessage (message) {
        let value = message.values[0];
        this.addData(value.value);

    }

    addData (data) {
        this.setState(oldState => {
            return {
                data: oldState.data.concat({
                    x: oldState.counter,
                    y: this.converter(data)
                }),
                counter: oldState.counter + 1,
                yDomain: this.getYDomain()
            }
        });
    }

    getYDomain () {
        let data = this.state.data.slice(Math.max(this.state.data.length - this.props.numberOfPointsToShow, 0), this.state.data.length);

        let absMax = Math.max(...data.map(item => item.y).map(Math.abs));
        // let absMax = data.reduce((accumulator, current) => {
        //     if (Math.abs(current.y) > Math.abs(accumulator.y)) {
        //         return current
        //     } else {
        //         return accumulator
        //     }
        // });

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
        return (<div className="parent">
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
                        >
                        <HorizontalGridLines />
                        <LineSeries data={this.state.data}
                        />
                        <XAxis
                            xDomain={[this.state.counter - this.props.numberOfPointsToShow, this.state.counter]}
                            hideTicks
                            orientation={"top"}
                        />
                        <YAxis
                            yDomain={this.state.yDomain}
                        />
                </XYPlot>
            </div>
        )
    }
}

export default Visualiser