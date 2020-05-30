import {HorizontalGridLines, LineSeries, XAxis, XYPlot, YAxis} from "react-vis";
import React from "react";

const Visualiser = ({animate, colors, counter, data, height, legend, negate, numberOfPointsToShow, trendData, trendline, unit, width, yDomain}) => {
    const {background, primary} = colors;

    const lineStyle = {stroke: primary, backgroundColor: background};

    return (
        <div className="parent with-shadow" style={{ color: primary, backgroundColor: background}}>
            <div className="legend" style={{height: height * 0.1}}>
                {legend}, {unit}
            </div>
            <XYPlot className="plot"
                    animation={animate}
                    width={width}
                    height={height * 0.846}
                    xDomain={[counter - numberOfPointsToShow, counter]}
                    yDomain={yDomain}
                    getY={y => negate? -y.y : y.y}
            >
                <HorizontalGridLines
                    style={{...lineStyle}}
                />
                <LineSeries
                    data={data}
                    style={{...lineStyle, strokeDasharray: "10, 10", strokeWidth: 1}}
                />

                {trendline ? <LineSeries
                    data={trendData}
                    style={{...lineStyle, strokeWidth: 2}}
                /> : <span />}

                <XAxis
                    xDomain={[counter - numberOfPointsToShow, counter]}
                    hideTicks
                    // orientation={"top"}
                    style={lineStyle}

                />
                <YAxis
                    yDomain={yDomain}
                    style={lineStyle}
                />
            </XYPlot>
        </div>
    )
}

export default Visualiser;