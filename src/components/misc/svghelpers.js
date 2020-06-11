import React from "react";
import * as PropTypes from "prop-types";
import isEqual from "react-fast-compare";

class Svghelpers {
    static getDivisionCoordinates (center, radius, length, numberOfDivisions, angleProvider) {
        let lines = [];

        for (let i = 0; i < numberOfDivisions; i++) {
            let angle = angleProvider(i);
            // console.log(angle);
            let start = this.polarToCartesian(angle, radius, center);
            let end = this.polarToCartesian(angle, radius - length, center);

            lines.push({start: start, end: end});
        }

        return lines;
    }


    static polarToCartesian (theta, r, offset) {
        return {x: offset.x + Math.sin(theta) * r, y: offset.y + Math.cos(theta) * r};
    }

    static getSectorPath(x, y, radius, a1, a2) {
        const degtorad = Math.PI / 180;
        const cr = radius;
        const cx1 =  Math.cos(degtorad * a2) * cr + x;
        const cy1 = -Math.sin(degtorad * a2) * cr + y;
        const cx2 =  Math.cos(degtorad * a1) * cr + x;
        const cy2 = -Math.sin(degtorad * a1) * cr + y;

        const otherWay = a1 < a2 ? "1" : "0";
        const large = a1 - a2 > 180 ? "1" : "0";

        return `M${x} ${y} ${cx1} ${cy1} A${cr} ${cr} 0 ${large} ${otherWay} ${cx2} ${cy2}Z`;
        // return `M${x} ${y} ${cx1} ${cy1} A${cr} ${cr} 0 0 ${1} ${cx2} ${cy2}Z`;
    }

    static getSector (centerX, centerY, radius, width, startAngle, endAngle, fillColor, key) {
        return <g key={key}>
            <path d={this.getSectorPath(centerX, centerY, radius              , 90 + startAngle, 90 + endAngle)} fill={fillColor}/>
            <path d={this.getSectorPath(centerX, centerY, radius - width, 90 + startAngle, 90 + endAngle)} fillOpacity={1} />
        </g>
    }
}

const LineDivision = ({ center, radius, length, numberOfLines, fontSize, angleProvider, textProvider, rotateText }) => {
    let lines = Svghelpers.getDivisionCoordinates(center, radius, length, numberOfLines, angleProvider);
    let textPositions = Svghelpers.getDivisionCoordinates(center, radius - 1.5 * length, 0, numberOfLines, angleProvider);

    return (
        <g fontSize={fontSize}>
            {lines.map((item, index) => <line   key={index}
                                                        x1={item.start.x}
                                                        y1={item.start.y}
                                                        x2={item.end.x}
                                                        y2={item.end.y}
            />)
            }
            <g stroke={"none"}>
                {
                    textPositions.map((item, index) => <text
                        key={index}
                        alignmentBaseline={"middle"}
                        transform={`rotate(${rotateText ? 180 - angleProvider(index) / Math.PI * 180 : 0}, ${item.start.x}, ${item.start.y})`}
                        x={item.start.x} y={item.start.y} textAnchor="middle">{textProvider(index)}</text>)
                }
            </g>
        </g>
    )
}

export class LineDivisions extends React.Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !isEqual(this.props, nextProps);
    }

    render() {
        let {center, radius, divisions, rotateText} = this.props;
        return <g>
            {divisions.map((division, index) => {
                return <LineDivision
                    center={center}
                    radius={radius}
                    length={division.lineLength * radius}
                    fontSize={division.fontSize}
                    angleProvider={division.angleProvider}
                    textProvider={division.textProvider}
                    numberOfLines={division.numberOfLines}
                    rotateText={rotateText}
                    key={index}
                />
            })}
        </g>
    }
}

export default Svghelpers;