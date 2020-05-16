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
                    y: data
                }),
                counter: oldState.counter + 1,
                yDomain: this.getYDomain()
            }
        });
    }

    getYDomain () {
        console.log("moimiomio", this.state, Math.max(this.state.data.length - this.props.numberOfPointsToShow, 0), this.state.data.length)
        let data = this.state.data.slice(Math.max(this.state.data.length - this.props.numberOfPointsToShow, 0), this.state.data.length);
        console.log(data);

        let absMax = Math.max(...data.map(item => item.y).map(Math.abs));
        // let absMax = data.reduce((accumulator, current) => {
        //     if (Math.abs(current.y) > Math.abs(accumulator.y)) {
        //         return current
        //     } else {
        //         return accumulator
        //     }
        // });
        console.log(absMax);

        var closest = this.props.ranges.reduce((accumulator, current) => {
            if (current > absMax && accumulator < absMax) {
                return current;
            } else {
                return accumulator;
            }
        });

        console.log(this.state.yDomain);

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
                    <XYPlot
                        animation={true}
                        width={this.props.width}
                        height={this.props.height * 0.9}
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
                            // title={"Syvyys kölin alla, m"}
                            orientation={"top"}
                            // style={{
                            //     fontSize: "85%",
                            //     fontFamily: "Courier new",
                            //     color: "white",
                            //     // padding: "10%"
                            // }}
                        />
                        <YAxis
                            yDomain={this.state.yDomain}
                            left={this.props.width * 0.88}
                            // orientation={"right"}
                            // left={0}
                            // tickSize={6}
                        />

                        {/*<ChartLabel*/}
                        {/*    text="Y Axisasd"*/}
                        {/*    className="legend"*/}
                        {/*    includeMargin={false}*/}
                        {/*    xPercent={0.9}*/}
                        {/*    yPercent={0.05}*/}
                        {/*    style={{*/}
                        {/*      // transform: 'rotate(-90)',*/}
                        {/*        fontSize: "200",*/}
                        {/*        textAnchor: 'end'*/}
                        {/*    }}*/}
                        {/*    />*/}
                </XYPlot>
            </div>
        )
    }
}

export default Visualiser