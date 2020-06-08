import  React from "react";

import CompassContainer from "./instruments/compass/CompassContainer"
import TridataContainer from "./instruments/tridata/TridataContainer";

import "./instruments.css"
import InstrumentContainer from "./instrumentcontainer";
import WindContainer from "./instruments/wind/WindContainer";
import GaugeContainer from "./instruments/gauge/GaugeContainer";
import VisualiserContainer from "./instruments/visualiser/VisualiserContainer";

// const server_root = "ws://192.168.1.115:3000";

const endpoint = "/signalk/v1";

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
        this.ws = new WebSocket(this.props.server + endpoint + "/stream/?subscribe=none");
    }

    componentDidMount () {
        const preparePath = (name) => {
            return {
                "path": name,
                "period": 2000,
                "format": "delta",
                "policy": "fixed",
                // "minPeriod": 500
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
                        update.values.forEach(value => {
                            subscriber.paths.forEach(subscriberPath => {
                                if (subscriberPath.test(value.path)) {
                                    subscriber.onDelta(update);
                                }
                            })
                        })
                    });

                } catch (err) {
                    console.debug("Instruments.js onMessage error: ", err, message)
                }
            }
        };
    }

    pathRegexToHTTP = path => path.toString()
        .replace(/([\\+.])+/g, "/")
        .replace(/\/+/g, "/")

    pathRegexToSignalkPath = path => this.pathRegexToHTTP(path)
        .replace(/\/$/, "")
        .replace(/^\//, "")
        .replace(/\//g, ".")


    giveMetadata(paths, onMetadata) {
        const HTTPServerRoot = "http:" + this.props.server.split(":").slice(1, 10).join(":");

        paths.forEach(path => {
            fetch(HTTPServerRoot + endpoint + "/api/vessels/self" + this.pathRegexToHTTP(path) + "meta")
                .then(response => response.json())
                .then(data => onMetadata(data, this.pathRegexToSignalkPath(path)))
                .catch(console.error)
        })
    }

    componentDidUpdate() {
        this.resetWebsocket();
        this.componentDidMount();
    }

    getSnapshotBeforeUpdate(prevProps) {
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
        const subscribe = (paths, onDelta, onMetadata) => {
            this.subscribers.push({paths, onDelta, onMetadata})
            this.giveMetadata(paths, onMetadata);
        };


        const instruments = [
            [TridataContainer, {}],
            [CompassContainer, {}],
            // [GaugeContainer, {}],
            [GaugeContainer, {}],
            [WindContainer, {}],
            // [VisualiserContainer, {path: /^environment.depth.belowTransducer$/, ranges: [5, 10, 20, 40, 100], numberOfPointsToShow: 100, negate: true, upperBound: 100, lowerBound: 0, legend: "Syvyys", unit: "m", trendlinePeriod: 4, trendline: true}],
            // [VisualiserContainer, {path: /^navigation.speedThroughWater$/, ranges: [8, 12], numberOfPointsToShow: 100, negate: false, upperBound: 12, lowerBound: 0, legend: "Nopeus", unit: "kts", convert: x => x * 3.6 / 1.852, trendlinePeriod: 10, trendline: true}],
            // [VisualiserContainer, {path: /^navigation.courseOverGroundTrue$/, ranges: [360], numberOfPointsToShow: 100, negate: false, upperBound: 360, lowerBound: 0, legend: "Suunta", unit: "°", convert: x => x / Math.PI * 180, trendlinePeriod: 10, trendline: true}],
            // [VisualiserContainer, {path: /^environment.wind.speedTrue$/, ranges: [10, 20, 50], numberOfPointsToShow: 200, negate: false, upperBound: 50, lowerBound: 0, legend: "Wind speed", unit: "kts", convert: x => x * 3.6 / 1.852, trendlinePeriod: 20, trendline: true}],
            // [VisualiserContainer, {path: /^environment.wind.speedTrue$/, ranges: [10, 20, 50], numberOfPointsToShow: 20, negate: false, upperBound: 50, lowerBound: 0, legend: "Wind speed", unit: "kts", convert: x => x * 3.6 / 1.852, trendlinePeriod: 6, trendline: true}],
            // [VisualiserContainer, {path: /electrical.batteries.1.voltage/, ranges: [15], numberOfPointsToShow: 100, negate: false, upperBound: 15, lowerBound: 0, legend: "Jännite", unit: "V", convert: x => x, trendlinePeriod: 10, trendline: true}],
            //
        ];

        // console.log("rerendering!")



        return (
            <div className="flexbox-container">
                {instruments.map((instrument, index) =>
                    <InstrumentContainer animate={this.props.animation} key={index} darkMode={this.props.darkMode} colors={this.props.colors} children={instrument[0]} callback={subscribe} additionalProps={instrument[1]} resizeDebounce={250} />
                )}
            </div>
        );
    }

}

export default Instruments
