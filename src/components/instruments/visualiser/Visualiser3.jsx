import React from "react";

import { Area, AreaChart, CartesianGrid, ReferenceArea, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { valueToPercentConverters, valueToPercentConvertersInverse } from "../../../misc/scaleConversions";
import { useSelector } from "react-redux";

// const data = [...Array(100).keys()].map(a => ({ x: a + 1, y: a + 1 }));

const getTicks = (data, ticksPerMagnitude, mapper, displayScale, converter, inverseConverter) => {
	let amount;
	if (displayScale.type === "logarithmic") {
		const { upper, lower } = displayScale;
		amount = ticksPerMagnitude * (Math.log10(upper) - Math.log10(lower));
	} else {
		amount = 2 * ticksPerMagnitude;
	}

	const stepSize = 1 / amount;

	const arr = [];

	for (let i = 0; i <= 1; i += stepSize) {
		arr.push(inverseConverter(i));
	}

	return arr;
};

const getDomain = (data, xRange, mapper = item => item.x) => {
	const max = Math.max(...data.map(mapper));
	return [max - xRange, max];
};

const getZones = (meta, domain, converter, colors) => {
	const { zones } = meta;

	return zones.map(zone => {
		const color = colors.zones[zone.state];
		return <ReferenceArea x1={domain[0]} x2={domain[1]} y1={converter(zone.lower)} y2={converter(zone.upper)} fill={color} />;
	});
};

const Visualiser3 = ({ data, meta, displayOptions, width, height }) => {
	const colors = useSelector(state => state.settings.appearance.colors);
	const darkMode = useSelector(state => state.settings.appearance.darkMode);
	const { displayScale } = meta;
	const { invertYAxis } = displayOptions;
	const { lower, upper, type, power } = displayScale;

	let inverseConverter;
	let converter;
	if (type === "power") {
		converter = valueToPercentConverters[type](upper, lower, power);
		inverseConverter = valueToPercentConvertersInverse[type](upper, lower, power);
	} else {
		converter = valueToPercentConverters[type](upper, lower);
		inverseConverter = valueToPercentConvertersInverse[type](upper, lower);
	}

	const convertedData = data.map(({ x, y }) => ({ x, y: converter(y) }));
	const ticks = getTicks(data, 4, item => item.y, displayScale, converter, inverseConverter);
	let domain = getDomain(data, 100);
	return (
		<div
			style={{
				padding: "2.5%",
				width: "100%",
				height: "100%",
				fontSize: "50%",
				position: "absolute",
				color: colors.primary,
				backgroundColor: colors.background,
			}}>
			<span style={{ marginLeft: "1%", marginBottom: "12%", position: "relative" }}>{meta.displayName}</span>
			<div
				style={{
					position: "relative",
					width: "100%",
					height: "92%",
					bottom: "0",
				}}>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<AreaChart data={convertedData} margin={{ top: 0.01 * width, bottom: 0.01 * width, left: 0.01 * width, right: 0.01 * width }}>
						<CartesianGrid strokeDasharray={"3 3"} stroke={colors.secondary} strokeOpacity={darkMode ? 1 : 0.2} />
						{getZones(meta, domain, converter, colors)}
						<XAxis
							dataKey={"x"}
							type={"number"}
							ticks={[null]}
							domain={domain}
							allowDecimals={false}
							allowDataOverflow={true}
							height={0}
						/>
						<Area
							type={"linear"}
							dataKey={"y"}
							stroke={colors.primary}
							strokeWidth={width * 0.01}
							strokeLinecap={"round"}
							strokeLinejoin={"round"}
							isAnimationActive={false}
							fill={"none"}
						/>
						<YAxis
							style={{ fontFamily: "sans-serif", fontSize: "50%", background: "white", fontWeight: "bold" }}
							width={0.125 * width}
							dataKey={"y"}
							tickFormatter={y => `${Math.round(inverseConverter(y) * 10) / 10} ${meta.units}`}
							ticks={ticks.map(converter)}
							reversed={invertYAxis}
							// tick={<CustomYAxisTick colors={colors} />}
							allowDataOverflow={true}
							color={colors.primary}
							mirror={true}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

Visualiser3.propTypes = {};

const CustomYAxisTick = ({ colors, ...props }) => {
	// console.log(props);
	const string = props.tickFormatter(props.payload.value);
	return (
		<g
			transform={`translate(${props.x},${props.y})`}
			width={props.width}
			height={props.height}
			style={{ zIndex: 1000, ...props.style }}
			className={props.className}>
			<text x={0} y={0} textAnchor="start" fill={colors.primary} stroke={colors.background} strokeWidth={5}>
				{string}
			</text>
			<text x={0} y={0} textAnchor="start" fill={colors.primary} stroke={"none"}>
				{string}
			</text>
		</g>
	);
};

export default Visualiser3;
