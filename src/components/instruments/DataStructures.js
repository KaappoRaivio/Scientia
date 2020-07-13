

export const displayScaleToLineDivisionSteps = displayScale => {
    // console.log([...Array(6).fill(0).map((_, index) => index)].map(x => 2 ** (-x)))
    // return [...Array(1).fill(0).map((_, index) => index)].map(x => 2 ** (-x))
    return [displayScale.upper / 10, displayScale.upper / 20];
    // console.log(displayScale)
    return [1, 0.5];
    // return [1, 0.5, 0.25, 0.125, 0.0625, 0.03125]
}