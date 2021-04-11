const rootConverter = root => (upper, lower) => x => {
	return (x ** (1 / root) - lower ** (1 / root)) / (upper ** (1 / root) - lower ** (1 / root));
};

export const valueToPercentConverters = {
	linear: (upper, lower) => x => (x - lower) / (upper - lower),
	logarithmic: (upper, lower) => x => {
		if (x === 0) {
			return 0;
		}
		return (Math.log10(x) - Math.log10(lower)) / (Math.log10(upper) - Math.log10(lower));
	},
	squareroot: rootConverter(2),
	root: (upper, lower, root) => rootConverter(root)(upper, lower),
	power: (upper, lower, power) => x => (x ** power - lower ** power) / (upper ** power - lower ** power),
};

export const valueToPercentConvertersInverse = {
	linear: (upper, lower) => y => y * (upper - lower) + lower,
	logarithmic: (upper, lower) => y => lower ** (1 - y) * upper ** y,
	squareroot: (upper, lower) => y => (y * (Math.sqrt(upper) - Math.sqrt(lower)) + Math.sqrt(lower)) ** 2,
	power: (upper, lower, power) => y => (y * (upper ** power - lower ** power) + lower ** power) ** (1 / power),
};
