import  React from "react";

import CompassWrapper from "./instruments/compass/CompassWrapper"
import Wind from "./instruments/wind/Wind"
import TridataContainer from "./instruments/tridata/TridataContainer";
import Visualiser from "./instruments/visualiser/Visualiser"

import "./instruments.css"
import InstrumentContainer from "./instrumentcontainer";
import WindContainer from "./instruments/wind/WindContainer";

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
                // "period": 500,
                "format": "delta",
                "policy": "instant",
                "minPeriod": 500
            }
        };

        this.ws.onopen = () => {
            this.ws.send(JSON.stringify({
                context: "vessels.self",
                subscribe: [
                    // preparePath("environment.depth.belowTransducer"),
                    // preparePath("environment.wind.*"),
                    // preparePath("navigation.speedThroughWater"),
                    // preparePath("navigation.courseOverGroundTrue"),
                    // preparePath("navigation.position"),
                    // preparePath("navigation.speedOverGround"),
                    preparePath("*"),
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
                                // let re = new RegExp(subscriberPath);
                                // console.log(value.path, re)
                                if (subscriberPath.test(value.path)) {
                                    subscriber.callback(update);
                                }
                            })
                        })
                    });

                } catch (err) {
                    console.error(err, message)
                }
            }
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
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
            [TridataContainer, {}],
            [CompassWrapper, {}],
            [WindContainer, {}],
            // [Visualiser, {path: /^environment.depth.belowTransducer$/, ranges: [5, 10, 20, 40, 100], numberOfPointsToShow: 100, negate: true, upperBound: 100, lowerBound: 0, legend: "Syvyys", unit: "m", trendlinePeriod: 4, trendline: true}],
            // [Visualiser, {path: /^navigation.speedThroughWater$/, ranges: [8, 12], numberOfPointsToShow: 100, negate: false, upperBound: 12, lowerBound: 0, legend: "Nopeus", unit: "kts", convert: x => x * 3.6 / 1.852, trendlinePeriod: 10, trendline: true}],
            // [Visualiser, {path: /^navigation.courseOverGroundTrue$/, ranges: [360], numberOfPointsToShow: 100, negate: false, upperBound: 360, lowerBound: 0, legend: "Suunta", unit: "°", convert: x => x / Math.PI * 180, trendlinePeriod: 10, trendline: true}],
            [Visualiser, {path: /^environment.wind.speedTrue$/, ranges: [10, 20, 50], numberOfPointsToShow: 100, negate: false, upperBound: 50, lowerBound: 0, legend: "Wind speed", unit: "kts", convert: x => x * 3.6 / 1.852, trendlinePeriod: 20, trendline: true}],
            // [Visualiser, {path: /electrical.batteries.1.voltage/, ranges: [15], numberOfPointsToShow: 100, negate: false, upperBound: 15, lowerBound: 0, legend: "Jännite", unit: "V", convert: x => x, trendlinePeriod: 10, trendline: true}],
            //
        ];

        // console.log("rerendering!")
        console.log(this.props.darkMode)



        return (
            <div key={"fixed"} className="flexbox-container">
                {instruments.map(instrument =>
                    <InstrumentContainer animate={true} key={instrument.id} darkMode={this.props.darkMode} colors={this.props.colors} children={instrument[0]} callback={setCallback} additionalProps={instrument[1]} resizeDebounce={250} />
                )}
            </div>
        );
    }
}

export default Instruments
