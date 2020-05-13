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
            return {
                data: oldState.data.concat({ // slice(1, Math.max(oldState.data.length, 10))
                    x: oldState.counter,
                    y: data
                }),
                counter: oldState.counter + 1,
            }
      })
    }

    render () {
        return (
            <XYPlot
                animation={true}
                width={this.props.width}
                height={this.props.height}
                xDomain={[this.state.counter - 10, this.state.counter]}
                yDomain={[0, this.props.upperBound]}
                // xRange={[this.state.counter - 20, this.state.counter]}
                // xType={"time"}
            >
                    <HorizontalGridLines />
                    <LineSeries data={this.state.data}/>
                <XAxis
                    xDomain={[this.state.counter - 10, this.state.counter]}
                />
                <YAxis
                    yDomain={[0, this.props.upperBound]}
                />
            </XYPlot>
        )
    }
}

export default Visualiser