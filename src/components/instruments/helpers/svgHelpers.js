import React from "react";
import * as PropTypes from "prop-types";
import _ from "underscore";

class SvgHelpers {
	static getDivisionCoordinates(center, radius, length, numberOfDivisions, angleProvider) {
		let lines = [];
		// console.log(center, radius, length);

		for (let i = 0; i < numberOfDivisions; i++) {
			let angle = angleProvider(i);

			let actualLength = _.isFunction(length) ? length(i) : length;
			// console.log(actualLength);

			let start = this.polarToCartesian(angle, radius, center);
			let end = this.polarToCartesian(angle, radius - actualLength, center);

			// console.log({ start: start, end: end });

			lines.push({ start: start, end: end });
		}

		return lines;
	}

	static polarToCartesian(theta, r, offset) {
		return {
			x: `${(offset.x + Math.sin(theta) * r) * 100}`,
			y: `${(offset.y + Math.cos(theta) * r) * 100}`,
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

		return `M${x * 100} ${y * 100} ${cx1 * 100} ${cy1 * 100} A${radius * 100} ${radius * 100} 0 ${large} ${otherWay} ${cx2 * 100} ${cy2 * 100}Z`;
	}

	static getSector(centerX, centerY, radius, width, startAngle, endAngle, fillColor, key) {
		return (
			<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" key={key}>
				<path
					d={this.getSectorPath(centerX, centerY, radius, 90 + startAngle, 90 + endAngle)}
					fill={fillColor}
					vectorEffect="non-scaling-stroke"
				/>
				<path
					d={this.getSectorPath(centerX, centerY, radius - width, 90 + startAngle, 90 + endAngle)}
					fillOpacity={1}
					vectorEffect="non-scaling-stroke"
				/>
			</svg>
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
	renderText,
}) => {
	let lines = SvgHelpers.getDivisionCoordinates(center, radius, length, numberOfLines, angleProvider);
	let textPositions = SvgHelpers.getDivisionCoordinates(center, textRadius, 0, numberOfLines, angleProvider);

	let path = `${lines.map((line, index) => `M${line.start.x} ${line.start.y} L${line.end.x} ${line.end.y}`).join(" ")} Z`;

	return (
		<svg
			width="100%"
			height="100%"
			viewBox="0 0 100 100"
			preserveAspectRatio="none"
			strokeWidth={strokeWidthMultiplier ? `${strokeWidthMultiplier * 100}%` : null}>
			<g stroke={"none"}>
				{renderText
					? textPositions.map((item, index) => (
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
								{/*fontSize={"10"}*/}
								{textProvider(index)}
							</text>
					  ))
					: null}
			</g>
			<path d={path} strokeWidth={"1%"} vectorEffect="non-scaling-stroke" />
		</svg>
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
							textRadius={textRadius || radius - 1.5 * division.lineLength}
							length={_.isFunction(division.lineLength) ? i => division.lineLength(i) : division.lineLength}
							fontSize={division.fontSize}
							angleProvider={division.angleProvider}
							renderText={division.renderText}
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
		divisions: PropTypes.arrayOf(
			PropTypes.shape({
				fontSize: PropTypes.number,
				lineLength: PropTypes.oneOfType([PropTypes.func, PropTypes.number]).isRequired,
				angleProvider: PropTypes.func.isRequired,
				textProvider: PropTypes.func.isRequired,
				strokeWidthMultiplier: PropTypes.number,
			})
		),
		rotateText: PropTypes.bool.isRequired,
		textRadius: PropTypes.number,
	};
}

export default SvgHelpers;
