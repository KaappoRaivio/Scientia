export const valueSkeleton = {
    value: null,
    units: null,
    zones: [],
    displayScale: {"upper": null, "lower": null, "type": "linear"},
    decimalPlaces: 1
};
export const camelCaseToSentenceCase = text => {
    const separated = text.replace(/([A-Z])/g, " $1").toLowerCase();
    return separated.charAt(0).toUpperCase() + separated.slice(1);
}

export const displayScaleToLineDivisionSteps = displayScale => {
    // console.log([...Array(6).fill(0).map((_, index) => index)].map(x => 2 ** (-x)))
    // return [...Array(1).fill(0).map((_, index) => index)].map(x => 2 ** (-x))
    return [1, 0.5, 0.1];
    // return [1, 0.5, 0.25, 0.125, 0.0625, 0.03125]
}