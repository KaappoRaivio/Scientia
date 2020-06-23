import {AreaSeries, HorizontalGridLines, LineSeries, XAxis, XYPlot, YAxis} from "react-vis";
import React from "react";
import NoData from "../../misc/NoData";
// import ChartistGraph from "react-chartist";


const truncate = (data, length) => {
    if (data.length > length) {
        while (data.length >= length) {
            data.shift();
        }
    }

    return data;
}

const getYDomain = (data, length, possibleRanges, negate) => {
    let slice = data.slice(Math.max(data.length - length, 0), data.length);

    let absMax = Math.max(...slice.map(item => item.y).map(Math.abs));

    let closest = possibleRanges.reduce((accumulator, current) => {
        if (current > absMax && accumulator < absMax) {
            return current;
        } else {
            return accumulator;
        }
    });

    if (closest < absMax) {
        closest = possibleRanges[possibleRanges.length - 1];
    }

    if (negate) {
        return [-closest, 0];
    } else {
        return [0, closest];
    }
}

const Visualiser = ({animate, colors, data, displayScale, height, legend, negate, numberOfPointsToShow, trendData, units, width}) => {
    if (displayScale == null || units == null || data == null) {
        console.log(displayScale, units, data)
        return <NoData width={width} height={height} colors={colors}/>
    }

    const {background, primary, accent1} = colors;

    const lineStyle = {stroke: primary, backgroundColor: background};

    // let yDomain = getYDomain(props.data, props.numberOfPointsToShow, props.ranges, props.negate);
    let yDomain = [displayScale.lower, displayScale.upper]
    let latestX = data[data.length - 1].x;
    let xDomain = [latestX - numberOfPointsToShow, latestX];

    truncate(data, numberOfPointsToShow);
    truncate(trendData, numberOfPointsToShow);

    return (
        <div className="parent with-shadow" style={{ color: primary, backgroundColor: background}}>
            {/*<ChartistGraph type="Line" data={simpleLineChartData}  options={options}/>*/}
            <div className="legend" style={{height: height * 0.1}}>
                {legend}, {units}
            </div>
            <XYPlot className="plot"
                    animation={animate ? {nonAnimatedProps: ["xDomain"]}: false}
                    width={width}
                    height={height * 0.846}
                    xDomain={xDomain}
                    yDomain={yDomain}
                    getY={y => negate? -(y.y) : y.y}
                    yType={"log"}
            >
                <HorizontalGridLines
                    style={{...lineStyle, strokeWidth: 0.5}}
                />

                <LineSeries
                    data={data}
                    style={{...lineStyle, strokeDasharray: "5, 5", strokeWidth: 0.5}}
                    // yType={"log"}
                />

                {trendData ? <AreaSeries
                    data={trendData}
                    style={{...lineStyle, strokeWidth: 1}}
                    fill={"rgba(155, 230, 255, 0.5)"}
                    // yType={"log"}
                /> : <span />}

                <XAxis
                    xDomain={xDomain}
                    hideTicks
                    style={lineStyle}

                />
                <YAxis
                    yDomain={yDomain}
                    style={{stroke: "none", fill: primary, fontSize: `70%`}}
                />
            </XYPlot>
        </div>
    )
}

export default Visualiser;