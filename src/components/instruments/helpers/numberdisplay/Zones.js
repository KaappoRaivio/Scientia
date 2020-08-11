export const checkForZones = (zones, value) => {
	zones = zones.sort((a, b) => zoneOrder[b.state] - zoneOrder[a.state]);
	let result = zones.map(zone => [zone.state, isIn(zone, value)]);

	let map = {};

	for (let key in result) {
		map[result[key][1]] = result[key][0];
	}
	return map[true] || "normal";
};

const isIn = (zone, value) => {
	return (zone.upper || Infinity) >= value && (zone.lower || -Infinity) <= value;
};

const zoneOrder = {
	normal: 5,
	alert: 4,
	warn: 3,
	alarm: 2,
	emergency: 1,
};
