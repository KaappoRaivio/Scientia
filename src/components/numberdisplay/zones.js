export const checkForZones = (zones, value) => {
    // console.log(value)
    let result = zones.map(zone => [zone.state, isIn(zone, value)])

    let map = {}

    for (let key in result) {
        // console.log(key)
        map[result[key][1]] = result[key][0];
    }
    // console.log(map)
    return map[true] || "normal";
    // console.log(result, "emergency" in result, result.emergency)
    // return "emergency" in result.keys() && result.emergency ? "emergency"
    //     : "alarm" in result.keys() && result.alarm ? "alarm"
    //     : "warn" in result.keys() && result.warn ? "warn"
    //     : "normal";
}

const isIn = (zone, value) => {
    return (zone.upper || Infinity) >= value && (zone.lower || -Infinity) <= value;
}