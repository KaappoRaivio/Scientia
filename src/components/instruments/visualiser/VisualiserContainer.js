import * as React from "react";

import "./visualiser.css"
import Visualiser from "./Visualiser";
import PropTypes from "prop-types";

class  VisualiserContainer extends React.Component {
    constructor(props) {
        super(props);

        let data = /*[...Array(1000).keys()].map((_, index) => ({x: index, y: index}))*/ [{x: 0, y: 1}];
        // // console.log(data);
        this.state = {
            counter: 0,
            data,
            trendData: [{x: 0, y: 1}],
            yDomain: [0, 0],
            displayScale: null,
            zones: null,
            units: null
        };

        if (this.props.convert) {
            this.converter = this.props.convert
        } else {
            this.converter = x => x;
        }

        this.firstTime = true;
    }

    subscribe () {
        const onDelta = message => {
            let value = message.values[0];
            this.addData(value.value);
        }

        const onMetadata = metadata => {
            // // console.log(metadata)
            this.setState({
                displayScale: metadata.displayScale,
                zones: metadata.zones,
                units: metadata.units
            })

            // // console.log(this.state)
        }

        this.props.subscribe([this.props.path], onDelta, onMetadata)
    }

    componentDidMount() {
        this.subscribe();
    }

    getTimeStamp = () => new Date().getTime() / 1000

    addData (dataPoint) {

        if (this.firstTime) {
            this.startTime = this.getTimeStamp();
            this.firstTime = false;
        }

        let trend = this.computeTrendDataPoint(this.state.data)

        this.setState(({data, trendData}) => {
            return {
                data: this.concatData(data, {x: this.getTimeStamp() - this.startTime, y: this.converter(dataPoint)}),
                trendData: this.concatData(trendData, trend),

            }
        });

    }

    getLatestX () {
        return this.state.data[this.state.data.length - 1].x + 1;
    }

    concatData(data, dataPoint) {
        let newArray;
        if (data[0].x === 0 || data[0].y === 1) {
            newArray = data.slice(1);
        } else {
            newArray = data.slice();
        }
        newArray.push(dataPoint);
        return newArray;
        // return data.concat(
        //     dataPoint
        // );
    }


    computeTrendDataPoint (data) {
        let dataPoints = data.slice(Math.max(data.length - this.props.trendlinePeriod, 0), data.length);
        if (!dataPoints.length) {
            return {x: 0, y: 0}
        }

        let lastPoint = this.state.data[this.state.data.length - 1];

        let x = this.getTimeStamp() - this.startTime;
        let y = dataPoints.map(a => a.y).reduce ((a, b) => a + b) / dataPoints.length;

        if (x < 0) {
            return {x: 0, y: 1}
        } else {
            return {x, y}
        }
    }

    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        ranges: PropTypes.arrayOf(PropTypes.number).isRequired,
        units: PropTypes.string.isRequired,
        fontSize: PropTypes.string.isRequired,
        trendlinePeriod: PropTypes.number.isRequired,
        animate: PropTypes.bool.isRequired,
        numberOfPointsToShow: PropTypes.number.isRequired,
        colors: PropTypes.object.isRequired,
        negate: PropTypes.bool
    }

    render () {
        const { width, fontSize, trendlinePeriod, animate, height, legend, numberOfPointsToShow, negate, colors, ranges } = this.props;
        const { units, displayScale } = this.state;
        return <Visualiser
            legend={legend}
            units={units}
            displayScale={displayScale}

            animate={animate}
            colors={colors}

            width={width}
            height={height}
            fontSize={fontSize}

            data={this.state.data}
            trendData={this.state.trendData}
            trendlinePeriod={trendlinePeriod}
            numberOfPointsToShow={numberOfPointsToShow}
            negate={negate}

            ranges={ranges}
        />
    }
}

export default VisualiserContainer;