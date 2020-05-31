import {AreaSeries, HorizontalGridLines, LineSeries, VerticalGridLines, XAxis, XYPlot, YAxis} from "react-vis";
import React from "react";
import ChartistGraph from "react-chartist";


const truncate = (data, length) => {
    if (data.length > length) {
        while (data.length > length + 1) {
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

const Visualiser = (props) => {
    const {background, primary} = props.colors;

    const lineStyle = {stroke: primary, backgroundColor: background};

    let yDomain = getYDomain(props.data, props.numberOfPointsToShow, props.ranges, props.negate);
    let latestX = props.data[props.data.length - 1].x;

    truncate(props.data, 5);
    console.log(props.data, props.trendData)

    let simpleLineChartData = {
        labels: [1, 2, 3, 4, 5, 6],
        series: [
            [12, 9, 7, 8, 5],
            [2, 1, 3.5, 7, 3],
            [1, 3, 4, 5, 6]
        ]
    };

    let options = {
        height: props.height
    }

    return (
        <div className="parent with-shadow" style={{ color: primary, backgroundColor: background}}>
            <ChartistGraph type="Line" data={simpleLineChartData}  options={options}/>
            {/*<div className="legend" style={{height: props.height * 0.1}}>*/}
            {/*    {props.legend}, {props.unit}*/}
            {/*</div>*/}
            {/*<XYPlot className="plot"*/}
            {/*        animation={props.animate ? {nonAnimatedProps: ["xDomain"]}: false}*/}
            {/*        width={props.width}*/}
            {/*        height={props.height * 0.846}*/}
            {/*        xDomain={[latestX - props.numberOfPointsToShow, latestX]}*/}
            {/*        yDomain={yDomain}*/}
            {/*        getY={y => props.negate? -y.y : y.y}*/}
            {/*>*/}
            {/*    <HorizontalGridLines*/}
            {/*        style={{...lineStyle, strokeWidth: 0.5}}*/}
            {/*    />*/}
            {/*    /!*<VerticalGridLines*!/*/}
            {/*    /!*    style={{...lineStyle}}*!/*/}
            {/*    /!>*!/*/}


            {/*    <LineSeries*/}
            {/*        data={props.data}*/}
            {/*        style={{...lineStyle, /*strokeDasharray: "10, 10", strokeWidth: 1}}}
            {/*    />*/}

            {/*    {props.trendData ? <AreaSeries*/}
            {/*        data={props.trendData}*/}
            {/*        style={{...lineStyle, strokeWidth: 0}}*/}
            {/*        fill={"rgba(0, 30, 255, 0.5)"}*/}
            {/*    /> : <span />}*/}

            {/*    <XAxis*/}
            {/*        xDomain={[latestX - props.numberOfPointsToShow, latestX]}*/}
            {/*        hideTicks*/}
            {/*        style={lineStyle}*/}

            {/*    />*/}
            {/*    <YAxis*/}
            {/*        yDomain={yDomain}*/}
            {/*        style={{...lineStyle, fontSize: 12.5}}*/}
            {/*    />*/}
            {/*</XYPlot>*/}
        </div>
    )
}

export default Visualiser;