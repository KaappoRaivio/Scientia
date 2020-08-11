import { checkForZones } from "./Zones.js";

const plainZones = [
	{
		upper: 10,
		lower: 6,
		state: "alert",
	},
	{
		lower: 10,
		state: "normal",
	},
	{
		upper: 6,
		lower: 3,
		state: "warn",
	},
	{
		upper: 3,
		lower: 2,
		state: "alarm",
	},
	{
		upper: 2,
		state: "emergency",
	},
];

const overlappingZones = [
	{
		upper: 10,
		lower: 6,
		state: "alert",
	},
	{
		upper: 7,
		lower: 3,
		state: "warn",
	},
	{
		lower: 8,
		state: "normal",
	},
];

const missingZones = [
	{
		upper: 8,
		state: "alarm",
	},
];

it("should return alarm condition based on provided zones", () => {
	expect(checkForZones(plainZones, 2.5)).toEqual("alarm");
	expect(checkForZones(plainZones, 5)).toEqual("warn");
});

it("should return the most severe zone if the value is on the edge of two zones", () => {
	expect(checkForZones(plainZones, 10)).toEqual("alert");
	expect(checkForZones(plainZones, 2)).toEqual("emergency");
});

it("should return the most severe zone if multiple ones overlap", () => {
	expect(checkForZones(overlappingZones, 9)).toEqual("alert");
	expect(checkForZones(overlappingZones, 6.5)).toEqual("warn");
});

it("should return 'normal' for undefined values", () => {
	expect(checkForZones(missingZones, 9)).toEqual("normal");
});
