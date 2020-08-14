import React from "react";
import * as PropTypes from "prop-types";
import _ from "underscore";

class SvgHelpers {
	static getDivisionCoordinates(center, radius, length, numberOfDivisions, angleProvider) {
		let lines = [];

		for (let i = 0; i < numberOfDivisions; i++) {
			let angle = angleProvider(i);

			let actualLength = _.isFunction(length) ? length(i) : length;

			let start = this.polarToCartesian(angle, radius, center);
			let end = this.polarToCartesian(angle, radius - actualLength, center);

			lines.push({ start: start, end: end });
		}

		return lines;
	}

	static polarToCartesian(theta, r, offset) {
		return {
			x: offset.x + Math.sin(theta) * r,
			y: offset.y + Math.cos(theta) * r,
		};
	}

	static getSectorPath(x, y, radius, a1, a2) {
		const radians = Math.PI / 180;

		const cx1 = Math.cos(radians * a2) * radius + x;
		const cy1 = -Math.sin(radians * a2) * radius + y;
		const cx2 = Math.cos(radians * a1) * radius + x;
		const cy2 = -Math.sin(radians * a1) * radius + y;

		const otherWay = a1 < a2 ? "1" : "0";
		const large = a1 - a2 > 180 ? "1" : "0";

		return `M${x} ${y} ${cx1} ${cy1} A${radius} ${radius} 0 ${large} ${otherWay} ${cx2} ${cy2}Z`;
	}

	static getSector(centerX, centerY, radius, width, startAngle, endAngle, fillColor, key) {
		return (
			<g key={key}>
				<path d={this.getSectorPath(centerX, centerY, radius, 90 + startAngle, 90 + endAngle)} fill={fillColor} />
				<path d={this.getSectorPath(centerX, centerY, radius - width, 90 + startAngle, 90 + endAngle)} fillOpacity={1} />
			</g>
		);
	}
}

const LineTickSection = ({
	center,
	radius,
	textRadius,
	length,
	numberOfLines,
	fontSize,
	angleProvider,
	textProvider,
	rotateText,
	strokeWidthMultiplier,
}) => {
	let lines = SvgHelpers.getDivisionCoordinates(center, radius, length, numberOfLines, angleProvider);
	let textPositions = SvgHelpers.getDivisionCoordinates(center, textRadius, 0, numberOfLines, angleProvider);

	let path = `${lines.map((line, index) => `M${line.start.x} ${line.start.y} L${line.end.x} ${line.end.y}`)} Z`;

	return (
		<g strokeWidth={strokeWidthMultiplier ? radius * strokeWidthMultiplier : null}>
			<path d={path} />

			<g stroke={"none"}>
				{textPositions.map((item, index) => (
					<text
						key={index}
						alignmentBaseline={"middle"}
						transform={`rotate(${rotateText ? 180 - (angleProvider(index) / Math.PI) * 180 : 0}, ${item.start.x || 0}, ${
							item.start.y || 0
						})`}
						x={item.start.x || 0}
						y={item.start.y || 0}
						textAnchor="middle"
						fontSize={_.isFunction(fontSize) ? fontSize(index) : fontSize}>
						{textProvider(index)}
					</text>
				))}
			</g>
		</g>
	);
};

export class LineTickSections extends React.Component {
	render() {
		let { center, radius, divisions, rotateText, textRadius } = this.props;
		return (
			<g>
				{divisions.map((division, index) => {
					return (
						<LineTickSection
							center={center}
							radius={radius}
							textRadius={textRadius || radius - 1.5 * division.lineLength * radius}
							length={_.isFunction(division.lineLength) ? i => division.lineLength(i) * radius : division.lineLength * radius}
							fontSize={division.fontSize}
							angleProvider={division.angleProvider}
							textProvider={division.textProvider}
							numberOfLines={division.numberOfLines}
							rotateText={rotateText}
							key={index}
							strokeWidthMultiplier={division.strokeWidthMultiplier}
						/>
					);
				})}
			</g>
		);
	}

	static propTypes = {
		center: PropTypes.shape({
			x: PropTypes.number.isRequired,
			y: PropTypes.number.isRequired,
		}),
		radius: PropTypes.number.isRequired,
		divisions: PropTypes.arrayOf({
			fontSize: PropTypes.number.isRequired,
			lineLength: PropTypes.oneOf([PropTypes.func.isRequired, PropTypes.number.isRequired]).isRequired,
			angleProvider: PropTypes.func.isRequired,
			textProvider: PropTypes.func.isRequired,
			strokeWidthMultiplier: PropTypes.number.isRequired,
		}),
		rotateText: PropTypes.bool.isRequired,
		textRadius: PropTypes.number,
	};
}

export default SvgHelpers;
