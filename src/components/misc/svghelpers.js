import React from "react";

class Svghelpers {
    getDivisionCoordinates (centerX, centerY, radius, length, numberOfDivisions, angleProvider) {
        let lines = [];

        for (let i = 0; i < numberOfDivisions; i++) {
            let angle = angleProvider(i);
            let start = this.polarToCartesian(angle, radius, centerX, centerY);
            let end = this.polarToCartesian(angle, radius + length, centerX, centerY);

            lines.push({start: start, end: end});
        }

        return lines;
    }

    drawDivision (centerX, centerY, radius, length, numberOfDivisions, fontSize, angleProvider, textProvider, rotateText) {
        let lines = this.getDivisionCoordinates(centerX, centerY, radius, length, numberOfDivisions, angleProvider);
        let textPositions = this.getDivisionCoordinates(centerX, centerY, radius + 1.5 * length, 0, numberOfDivisions, angleProvider);

        return (
            <g fontSize={fontSize}>
                {lines.map((item, index) => <line   key={item.start.x * 32 + item.start.y}
                                                            x1={item.start.x}
                                                            y1={item.start.y}
                                                            x2={item.end.x}
                                                            y2={item.end.y}
                                                            />)
                }
                {
                    textPositions.map((item, index) => <text
                        // transform={`rotate(${360 - angleProvider(index) / Math.PI * 180}, ${item[0][0]}, ${item[0][1]})`}
                        key={item.start.x * 32 + item.start.y}
                        alignmentBaseline={"middle"}
                        transform={`rotate(${rotateText ? 180 - angleProvider(index) / Math.PI * 180 : 0}, ${item.start.x}, ${item.start.y})`}
                        x={item.start.x} y={item.start.y} textAnchor="middle">{textProvider(index)}</text>)
                }
            </g>
        )
    }

    polarToCartesian (theta, r, offsetX, offsetY) {
        return {x: offsetX + Math.sin(theta) * r, y: offsetY + Math.cos(theta) * r};
    }

    getSectorPath(x, y, radius, a1, a2) {
        const degtorad = Math.PI / 180;
        const cr = radius;
        const cx1 =  Math.cos(degtorad * a2) * cr + x;
        const cy1 = -Math.sin(degtorad * a2) * cr + y;
        const cx2 =  Math.cos(degtorad * a1) * cr + x;
        const cy2 = -Math.sin(degtorad * a1) * cr + y;

        const otherWay = a1 < a2 ? "1" : "0";

        return `M${x} ${y} ${cx1} ${cy1} A${cr} ${cr} 0 0 ${otherWay} ${cx2} ${cy2}Z`;
    }

    getSector (centerX, centerY, radius, width, startAngle, endAngle, fillColor) {
        return <g>
            <path d={this.getSectorPath(centerX, centerY, radius              , 90 + startAngle, 90 + endAngle)} fill={fillColor}/>
            <path d={this.getSectorPath(centerX, centerY, radius - width, 90 + startAngle, 90 + endAngle)} fillOpacity={1} />
        </g>
    }
}

export default Svghelpers;