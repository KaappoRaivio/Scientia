import React from "react";

import "chart.css";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { scaleLog } from "d3-scale";
import { valueToPercentConverters, valueToPercentConvertersInverse } from "../../../misc/scaleConversions";

// const data = [
// 	{ x: 0, y: 10 },
// 	{ x: 1, y: 5 },
// 	{ x: 2, y: 8 },
// 	{ x: 4, y: 14 },
// ];

const data = [...Array(100).keys()].map(a => ({ x: a + 1, y: a + 1 }));
// const data = [
// 	{
// 		x: 2.114,
// 		y: 11.93154183039472,
// 	},
// 	{
// 		x: 3.125,
// 		y: 10.192299786962748,
// 	},
// 	{
// 		x: 4.158,
// 		y: 9.903178053007577,
// 	},
// 	{
// 		x: 5.323,
// 		y: 9.903178053007577,
// 	},
// 	{
// 		x: 6.701,
// 		y: 9.903178053007577,
// 	},
// 	{
// 		x: 8.116,
// 		y: 9.607695841876875,
// 	},
// 	{
// 		x: 9.119,
// 		y: 9.607695841876875,
// 	},
// 	{
// 		x: 10.331,
// 		y: 10.337784552507987,
// 	},
// 	{
// 		x: 11.332,
// 		y: 10.897024288102202,
// 	},
// 	{
// 		x: 12.345,
// 		y: 10.337784552507987,
// 	},
// ];

const getTicks = (data, ticksPerMagnitude, mapper, displayScale, converter, inverseConverter) => {
	if (displayScale.type === "logarithmic") {
		// const min = Math.round(Math.min(...data.map(mapper)));
		// const max = Math.round(Math.max(...data.map(mapper)));
		const amount = ticksPerMagnitude * (Math.log10(displayScale.upper) - Math.log10(displayScale.lower));
		const stepSize = 1 / amount;

		const arr = [];

		for (let i = 0; i < 1; i += stepSize) {
			// arr.push(inverseConverter(i * (displayScale.upper - displayScale.lower) + displayScale.lower));
			arr.push(inverseConverter(i));
		}

		return [displayScale.lower].concat(arr);
	} else {
		console.log("mitä vittua");
		return [];
	}
};

const getDomain = (data, xRange, mapper = item => item.x) => {
	const max = Math.max(...data.map(mapper));
	return [max - xRange, max];
};

const applyScale = (data, displayScale) => {
	const { lower, upper, type } = displayScale;
	const converter = valueToPercentConverters[type](upper, lower);
	return data.map(({ x, y }) => ({ x, y: converter(y) * (upper - lower) + lower }));
};

const Visualiser3 = ({ data, meta, width, height }) => {
	// const scale =
	// const a = applyScale(data, );
	// console.log(data, a);

	const { displayScale } = meta;
	// const displayScale = { upper: 100, lower: 0.1, type: "logarithmic" };
	const { lower, upper, type } = displayScale;
	const converter = x => valueToPercentConverters[type](upper, lower)(x);
	const inverseConverter = x => valueToPercentConvertersInverse[type](upper, lower)(x);

	const convertedData = data.map(({ x, y }) => ({ x, y: converter(y) }));
	const ticks = getTicks(data, 4, item => item.y, displayScale, converter, inverseConverter);
	return (
		<div style={{ padding: "2.5%", width: "100%", height: "100%", fontSize: "50%", position: "absolute" }}>
			<span style={{ marginLeft: "6%", marginBottom: "12%", position: "relative" }}>{meta.displayName}</span>
			<div
				style={{
					position: "relative",
					width: "100%",
					height: "92%",
					bottom: "0",
				}}>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<AreaChart data={convertedData}>
						<CartesianGrid strokeDasharray={"3 3"} />
						<XAxis dataKey={"x"} type={"number"} ticks={[null]} domain={getDomain(data, 100)} allowDecimals={false} height={0} />
						<YAxis
							style={{ fontFamily: "sans-serif", fontSize: "50%" }}
							width={0.06 * width}
							dataKey={"y"}
							tickFormatter={y => Math.round(inverseConverter(y) * 10) / 10}
							ticks={ticks.map(converter)}
							reversed={true}
						/>
						<Area type={"linear"} dataKey={"y"} stroke={"black"} isAnimationActive={false} />
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

Visualiser3.propTypes = {};

export default Visualiser3;
