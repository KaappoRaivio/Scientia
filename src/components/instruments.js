import  React from "react";

import Compass from "./compass"
import Wind from "./wind"
import Tridata from "./tridata";
import Visualiser from "./visualiser"

import "./instruments.css"
import InstrumentContainer from "./instrumentcontainer";

// const server_root = "ws://192.168.1.115:3000";

class Instruments extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            data: null
        };

        this.resetWebsocket();
        this.subscribers = []

    }

    resetWebsocket () {
        this.ws = new WebSocket(this.props.server + "/signalk/v1/stream/?subscribe=none");
    }

    componentDidMount () {
        const preparePath = (name) => {
            return {
                "path": name,
                "period": 500,
                "format": "delta",
                "policy": "fixed",
                "minPeriod": 500
            }
        };

        this.ws.onopen = () => {
            console.log("open");
            this.ws.send(JSON.stringify({
                context: "vessels.self",
                subscribe: [
                    preparePath("environment.depth.belowTransducer"),
                    preparePath("environment.wind.*"),
                    preparePath("navigation.speedThroughWater"),
                    preparePath("navigation.courseOverGroundTrue"),
                    preparePath("navigation.position"),
                    preparePath("navigation.speedOverGround"),
                    preparePath("performance.velocityMadeGood"),
                ]
            }))
        };

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            // console.log(message)

            for (const subscriber of this.subscribers) {
                try {

                    message.updates.forEach(update => {
                        // console.log(update)
                        update.values.forEach(value => {
                            subscriber.paths.forEach(subscriberPath => {
                                let re = new RegExp(subscriberPath);
                                // console.log(value.path, re)
                                if (re.test(value.path)) {
                                    subscriber.callback(update);
                                }
                            })
                        })
                    });

                } catch (err) {
                    console.error(err)
                }
            }
        };
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.server !== this.props.server;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(this.props.server)
        this.resetWebsocket();
        this.componentDidMount();
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (this.ws.readyState) {
            this.ws.send(JSON.stringify({
                "context": "*",
                "unsubscribe": [{
                    "path": "*"
                }]
            }))
        }
        this.ws.close(1000, `Changing server from ${prevProps.server}`)
    }

    render () {
        const setCallback = (paths, callback) => {
            this.subscribers.push({paths: paths, callback: callback})
        };

        const instruments = [
            [Wind, {}],
            [Compass, {}],
            [Tridata, {}],
            [Visualiser, {path: "environment.depth.belowTransducer", ranges: [5, 10, 20, 40, 100], numberOfPointsToShow: 100, negate: true, upperBound: 100, lowerBound: 0, legend: "Syvyys", unit: "m"}],
            [Visualiser, {path: "navigation.speedThroughWater", ranges: [8, 12], numberOfPointsToShow: 100, negate: false, upperBound: 12, lowerBound: 0, legend: "Nopeus", unit: "kts", convert: x => x * 3.6 / 1.852}],
            [Visualiser, {path: "navigation.courseOverGroundTrue", ranges: [360], numberOfPointsToShow: 100, negate: false, upperBound: 360, lowerBound: 0, legend: "Suunta", unit: "°", convert: x => x / Math.PI * 180}],
            [Visualiser, {path: "environment.wind.speedApparent", ranges: [10, 20, 50], numberOfPointsToShow: 100, negate: false, upperBound: 50, lowerBound: 0, legend: "Tuulen nopeus", unit: "kts", convert: x => x * 3.6 / 1.852}],
        ];

        // console.log("rerendering!")

        return (
            <div className="flexbox-container">
                {instruments.map(instrument =>
                    <InstrumentContainer  children={instrument[0]} callback={setCallback} additionalProps={instrument[1]} resizeDebounce={250} />
                )}
            </div>
        );
    }
}

export default Instruments
