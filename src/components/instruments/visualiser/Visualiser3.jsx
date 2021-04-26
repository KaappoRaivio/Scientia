import React, { useDebugValue, useEffect } from "react";

import { Area, AreaChart, CartesianGrid, ReferenceArea, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { valueToPercentConverters, valueToPercentConvertersInverse } from "../../../misc/scaleConversions";
import { useSelector } from "react-redux";

const data = [...Array(100).keys()].map(a => ({ x: a + 1, y: a + 1 }));

const getDebugData = () => {
	return {
		data: [...Array(101).keys()].map(a => ({ x: a, y: a })),
		meta: {
			zones: [
				{
					lower: 10,
					state: "normal",
					message: "Normal depth",
				},
				{
					upper: 10,
					lower: 6,
					state: "alert",
					message: "Depth alert!",
				},
				{
					upper: 6,
					lower: 3,
					state: "warn",
					message: "Warning depth!",
				},
				{
					upper: 3,
					lower: 2,
					state: "alarm",
					message: "Shallow!",
				},
				{
					upper: 2,
					state: "emergency",
					message: "Grounding",
				},
			],
			displayScale: { type: "power", power: 2, upper: 100, lower: 0 },
		},
	};
};

const getTicksLinear = (upper, lower, targetLength) => {
	const rangeUpperBound = 10 ** Math.ceil(Math.log10(upper));
	const rangeLowerBound = 0;

	const steps = [0.01, 0.02, 0.1, 0.5, 1, 2, 5, 10, 20, 25, 50, 100, 200, 500, 1000];

	const allPossibleTicks = steps.map(step => getVisibleTicks(lower, upper, range(rangeLowerBound, rangeUpperBound, step)));

	return [
		// lower,
		// 0,
		...allPossibleTicks.reduce((accumulator, value) => {
			if (Math.abs(value.length - targetLength) < Math.abs(accumulator.length - targetLength)) {
				return value;
			} else {
				return accumulator;
			}
		}),
		upper,
	];
};

const range = (lower, upper, step) => {
	const array = [];
	for (let i = lower; i < upper; i += step) {
		array.push(i);
	}

	return array;
};

const getVisibleTicks = (lower, upper, ticks) => {
	let lowerBound;
	let upperBound;

	for (let i = 0; i < ticks.length; i++) {
		if (ticks[i] >= lower && lowerBound == null) {
			lowerBound = i;
		}
		if (ticks[i] > upper && upperBound == null) {
			upperBound = i;
		}
	}

	return ticks.slice(lowerBound, upperBound);
};

const getTicks = (data, targetLength, mapper, displayScale, converter, inverseConverter) => {
	// } else {
	// 	amount = 2 * ticksPerMagnitude;
	// }

	if (displayScale.type === "logarithmic") {
		const { upper, lower } = displayScale;
		const amount = (targetLength / 2) * (Math.log10(upper) - Math.log10(lower));
		const stepSize = 1 / amount;

		const arr = [];

		for (let i = 0; i <= 1; i += stepSize) {
			arr.push(inverseConverter(i));
		}

		return arr;
	} else if (displayScale.type === "linear" || displayScale.type === "power" || displayScale.type === "logarithmic") {
		return getTicksLinear(displayScale.upper, displayScale.lower, targetLength);
	}
};

const getDomain = (data, xRange, mapper = item => item.x) => {
	const max = Math.max(...data.map(mapper));
	return [max - xRange + 1, max];
};

const getZones = (meta, domain, converter, colors) => {
	const { zones } = meta;

	return zones.map(zone => {
		const color = colors.zones[zone.state];
		return <ReferenceArea x1={domain[0]} x2={domain[1]} y1={converter(zone.lower)} y2={converter(zone.upper)} fill={color} />;
	});
};

const Visualiser3 = ({ data, meta, displayOptions, width, height }) => {
	// data = getDebugData().data;
	// meta = getDebugData().meta;

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
	const ticks = getTicks(data, (height / width) * 10, item => item.y, displayScale, converter, inverseConverter);
	// console.log(ticks);
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
			<span style={{ marginLeft: "1%", position: "absolute" }}>{meta.displayName}</span>
			<div
				style={{
					position: "relative",
					width: "100%",
					height: "100%",
					bottom: "0",
				}}>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<AreaChart data={convertedData} margin={{ top: 0.01 * height, bottom: 0.01 * height, left: 0.01 * width, right: 0.01 * width }}>
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
							style={{ fontFamily: "sans-serif", fontSize: "75%", background: "white", fontWeight: "bold" }}
							width={0.125 * width}
							dataKey={"y"}
							tickFormatter={y => `${Math.round(inverseConverter(y) * 10) / 10} ${meta.units || ""}`}
							ticks={ticks.map(converter)}
							tickLine={false}
							reversed={invertYAxis}
							domain={[0, 1]}
							orientation={"right"}
							tick={<CustomYAxisTick colors={colors} />}
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
	// console.log(props.viewV);
	// useEffect(() => {
	// 	console.log(props);
	// }, [props]);

	const string = props.tickFormatter(props.payload.value);
	return (
		<g
			transform={`translate(${props.x},${props.y})`}
			width={props.width}
			height={props.height}
			style={{ zIndex: 1000, ...props.style }}
			className={props.className}>
			<defs>
				<filter id="rounded-corners" x="-5%" width="110%" y="0%" height="100%">
					<feFlood floodColor={colors.background} />
					<feGaussianBlur stdDeviation={2} />
					<feComponentTransfer>
						<feFuncA type="table" tableValues="0 0 0 1" />
					</feComponentTransfer>

					<feComponentTransfer>
						<feFuncA type="table" tableValues="0 1 1 1 1 1 1 1" />
					</feComponentTransfer>
					<feComposite operator="over" in="SourceGraphic" />
				</filter>

				<filter x="0" y="0" width="1" height="1" id="solid">
					<feGaussianBlur stdDeviation={1}>
						<feFlood floodColor="white" floodOpacity={0.7} result="bg" />
					</feGaussianBlur>
					<feMerge>
						<feMergeNode in="bg" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>
			{/*<text*/}
			{/*	x={0}*/}
			{/*	y={0}*/}
			{/*	textAnchor="end"*/}
			{/*	fill={colors.primary}*/}
			{/*	stroke={colors.background}*/}
			{/*	strokeWidth={10}*/}
			{/*	dominantBaseline={"middle"}>*/}
			{/*	{string}*/}
			{/*</text>*/}
			<text filter={"url(#rounded-corners)"} x={0} y={0} textAnchor="end" fill={colors.primary} stroke={"none"} dominantBaseline={"middle"}>
				{string}
			</text>
			{/*<rect x={0} y={0} width={props.width} height={"10"} fill={"orange"} stroke={"none"} />*/}
		</g>
	);
};

export default Visualiser3;
