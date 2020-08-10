import { mod } from "mathjs";

class Interpolator {
	constructor(angle) {
		this.previousData = 0;
		this.currentData = 0;

		if (angle === undefined) {
			angle = false;
		}

		this.angle = angle;

		this.dataPoints = [
			[new Date().getTime(), 0],
			[new Date().getTime() + 1000, 0],
		];
	}

	addDataPoint(timeStamp, data) {
		this.dataPoints.push([timeStamp, data]);
		while (this.dataPoints.length > 20) {
			this.dataPoints.shift();
		}
	}

	interpolate(timeStamp) {
		let latest = this.dataPoints[this.dataPoints.length - 1][0];
		let diff = timeStamp - latest;

		let averageDiff = this.getAverageDeltaTime();

		let progress = diff / averageDiff;
		return this.getLatestPairSlope()(progress * 2);
	}

	getAverageDeltaTime() {
		let previous = this.dataPoints[0][0];
		let diffs = [];

		for (let i = 1; i < this.dataPoints.length; i++) {
			let current = this.dataPoints[i][0];

			let diff = current - previous;
			diffs.push(diff);

			previous = current;
		}
		return diffs.reduce((a, b) => a + b, 0) / diffs.length;
	}

	deltaAngle(a, b) {
		let diff = a - b;
		return ((diff + Math.PI) % (2 * Math.PI)) - Math.PI;
	}

	normalizeAngle(a) {
		// if (a >= Math.PI) {
		//     return a - 2 * Math.PI;
		// } else if (a <= -Math.PI) {
		//     return a + 2* Math.PI;
		// } else {
		return a;
		// }
	}

	getLatestPairSlope() {
		let latest = this.dataPoints[this.dataPoints.length - 1];
		let other = this.dataPoints[this.dataPoints.length - 2];

		return (x) => {
			let deltaX = latest[0] - other[0];

			let deltaY = 0;

			if (this.angle) {
				let delta1 = this.deltaAngle(latest[1], other[1]);
				let delta2 = -this.deltaAngle(other[1], latest[1]);

				deltaY = Math.abs(delta1) < Math.abs(delta2) ? delta1 : delta2;
			} else {
				deltaY = latest[1] - other[1];
			}

			let speed = 3;

			// let k = -Math.sign(deltaY) * Math.PI * speed;
			let k = (deltaY / deltaX) * 1000 * speed;
			let b = other[1];

			if (this.angle) {
				x = Math.max(Math.min(x, 1 / speed), 0);
				// // console.log(x, mod(k * x + b, 2 * Math.PI) / Math.PI * 180, k, deltaX);
				return mod(k * x + b, 2 * Math.PI);
			} else {
				return k > 0
					? Math.min(k * x + b, latest[1])
					: Math.max(k * x + b, latest[1]);
			}
		};
	}

	magicTruthTable(k, y, t) {
		let cond = [k > 0, y < Math.PI, t > Math.PI]
			.map((k) => (k ? "1" : "0"))
			.join("");

		const table = {
			"000": Math.min,
			"001": Math.max,
			"010": Math.min,
			"011": Math.min,
			"100": Math.max,
			"101": Math.max,
			"110": Math.min,
			"111": Math.max,
		};

		return table[cond];
	}
}

export default Interpolator;
