import * as React from "react";
import {HorizontalGridLines, LineSeries, XAxis, XYPlot, YAxis} from "react-vis";

class Visualiser extends React.Component {
        constructor(props) {
        super(props);

        this.state = {
            counter: 0,
            data: [
              {x: 0, y: 0},
            ]
        };

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
        // this.setState({
        //
        // })
        // if
    }

    addData (data) {
        this.setState(oldState => {
            if (this.props.negate) {
                return {
                    data: oldState.data.concat({
                        x: oldState.counter,
                        y: -data
                    }),
                    counter: oldState.counter + 1,
                }
            } else {
                return {
                    data: oldState.data.concat({
                        x: oldState.counter,
                        y: data
                    }),
                    counter: oldState.counter + 1,
                }
            }
        })
    }

    render () {
        return (
            <XYPlot
                animation={true}
                width={this.props.width}
                height={this.props.height}
                xDomain={[this.state.counter - this.props.numberOfPointsToShow, this.state.counter]}
                yDomain={[this.props.lowerBound, this.props.upperBound]}
                // xRange={[this.state.counter - 20, this.state.counter]}
                // xType={"time"}
            >
                    <HorizontalGridLines />
                    <LineSeries data={this.state.data}/>
                <XAxis
                    xDomain={[this.state.counter - this.props.numberOfPointsToShow, this.state.counter]}
                />
                <YAxis
                    yDomain={[this.props.lowerBound, this.props.upperBound]}
                />
            </XYPlot>
        )
    }
}

export default Visualiser