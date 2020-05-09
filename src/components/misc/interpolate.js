class Interpolator {
    constructor () {
        this.previousData = 0;
        this.currentData = 0;


        this.dataPoints = [
            [new Date().getTime(), 0],
            [new Date().getTime() + 1000, 0]
        ];
    }

    addDataPoint (timeStamp, data) {
        this.dataPoints.push([timeStamp, data]);
        while (this.dataPoints.length > 20) {
            this.dataPoints.shift();
        }
        
    }

    interpolate (timeStamp) {
        let latest = this.dataPoints[this.dataPoints.length - 1][0];
        let diff = timeStamp - latest;

        let averageDiff = this.getAverageDeltaTime();

        let progress = diff / averageDiff;
        // console.log(averageDiff)
        return this.getLatestPairSlope()(progress * 1200)
    }

    getAverageDeltaTime () {
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

    getLatestPairSlope () {
        let latest = this.dataPoints[this.dataPoints.length - 1]
        let other = this.dataPoints[this.dataPoints.length - 2]

        return (x) => {
            // console.log(latest)
            // if (latest === undefined || other === undefined) {
            //     return [0, 0, 0, 0]
            // }
            // let yDiffs = latest[1].map((item, index) => item - other[1][index]);
            // let k = (latest[1] - other[1]) / (latest[0] - other[0]);
            // let slopes = yDiffs.map(item => item / (latest[0] - other[0]))
            // let constants = other[1];

            // return slopes.map((item, index) => item * x + constants[index]);
            // console.log(x + 0)
            // console.log(latest, other)
            let k = (latest[1] - other[1]) / (latest[0] - other[0]);
            let b = other[1];

            // return this.dataPoints[this.dataPoints.length - 1][1]
            // console.log(k.toFixed(5), x.toFixed(0), b.toFixed(0), (latest[1]))
            return k > 0 ? Math.min(k * x + b, latest[1]) : Math.max(k * x + b, latest[1])
            // return Math.abs(k*x + b) > Math.abs(latest[1]) ? latest[1] : k*x + b;
        }
    }
}

export default Interpolator;