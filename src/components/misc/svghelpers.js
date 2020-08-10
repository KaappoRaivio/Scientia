import React from "react";
import * as PropTypes from "prop-types";
import isEqual from "react-fast-compare";
import _ from "underscore";

class Svghelpers {
	static getDivisionCoordinates(
		center,
		radius,
		length,
		numberOfDivisions,
		angleProvider
	) {
		let lines = [];

		for (let i = 0; i < numberOfDivisions; i++) {
			let angle = angleProvider(i);
			// // console.log(angle);

			let actualLength = _.isFunction(length) ? length(i) : length;

			let start = this.polarToCartesian(angle, radius, center);
			let end = this.polarToCartesian(
				angle,
				radius - actualLength,
				center
			);

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
		const degtorad = Math.PI / 180;
		const cr = radius;
		const cx1 = Math.cos(degtorad * a2) * cr + x;
		const cy1 = -Math.sin(degtorad * a2) * cr + y;
		const cx2 = Math.cos(degtorad * a1) * cr + x;
		const cy2 = -Math.sin(degtorad * a1) * cr + y;

		const otherWay = a1 < a2 ? "1" : "0";
		const large = a1 - a2 > 180 ? "1" : "0";

		return `M${x} ${y} ${cx1} ${cy1} A${cr} ${cr} 0 ${large} ${otherWay} ${cx2} ${cy2}Z`;
		// return `M${x} ${y} ${cx1} ${cy1} A${cr} ${cr} 0 0 ${1} ${cx2} ${cy2}Z`;
	}

	static getSector(
		centerX,
		centerY,
		radius,
		width,
		startAngle,
		endAngle,
		fillColor,
		key
	) {
		return (
			<g key={key}>
				<path
					d={this.getSectorPath(
						centerX,
						centerY,
						radius,
						90 + startAngle,
						90 + endAngle
					)}
					fill={fillColor}
				/>
				<path
					d={this.getSectorPath(
						centerX,
						centerY,
						radius - width,
						90 + startAngle,
						90 + endAngle
					)}
					fillOpacity={1}
				/>
			</g>
		);
	}
}

const LineDivision = ({
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
	let lines = Svghelpers.getDivisionCoordinates(
		center,
		radius,
		length,
		numberOfLines,
		angleProvider
	);
	let textPositions = Svghelpers.getDivisionCoordinates(
		center,
		textRadius,
		0,
		numberOfLines,
		angleProvider
	);

	let path = `${lines.map(
		(line, index) =>
			`M${line.start.x} ${line.start.y} L${line.end.x} ${line.end.y}`
	)} Z`;

	return (
		<g
			strokeWidth={
				strokeWidthMultiplier ? radius * strokeWidthMultiplier : null
			}
		>
			<path d={path} />

			<g stroke={"none"}>
				{textPositions.map((item, index) => (
					<text
						// fontWeight={""}
						key={index}
						alignmentBaseline={"middle"}
						transform={`rotate(${
							rotateText
								? 180 - (angleProvider(index) / Math.PI) * 180
								: 0
						}, ${item.start.x || 0}, ${item.start.y || 0})`}
						x={item.start.x || 0}
						y={item.start.y || 0}
						textAnchor="middle"
						fontSize={
							_.isFunction(fontSize) ? fontSize(index) : fontSize
						}
					>
						{textProvider(index)}
					</text>
				))}
			</g>
		</g>
	);
};

export class LineDivisions extends React.Component {
	shouldComponentUpdate(nextProps, nextState, nextContext) {
		return !isEqual(this.props, nextProps);
	}

	render() {
		let { center, radius, divisions, rotateText, textRadius } = this.props;
		return (
			<g>
				{divisions.map((division, index) => {
					return (
						<LineDivision
							center={center}
							radius={radius}
							textRadius={
								textRadius ||
								radius - 1.5 * division.lineLength * radius
							}
							length={
								_.isFunction(division.lineLength)
									? (i) => division.lineLength(i) * radius
									: division.lineLength * radius
							}
							fontSize={division.fontSize}
							angleProvider={division.angleProvider}
							textProvider={division.textProvider}
							numberOfLines={division.numberOfLines}
							rotateText={rotateText}
							key={index}
							strokeWidthMultiplier={
								division.strokeWidthMultiplier
							}
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
			lineLength: PropTypes.oneOf(
				PropTypes.func.isRequired,
				PropTypes.number.isRequired
			),
			angleProvider: PropTypes.func.isRequired,
			textProvider: PropTypes.func.isRequired,
			strokeWidthMultiplier: PropTypes.number.isRequired,
		}),
		rotateText: PropTypes.bool.isRequired,
		textRadius: PropTypes.number,
	};
}

export default Svghelpers;
