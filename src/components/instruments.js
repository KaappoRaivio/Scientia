import  React from "react";

import CompassContainer from "./instruments/compass/CompassContainer"
import TridataContainer from "./instruments/tridata/TridataContainer";

import "./instruments.css"
import SingleInstrumentContainer from "./noninstruments/SingleInstrumentContainer";
import WindContainer from "./instruments/wind/WindContainer";
import GaugeContainer from "./instruments/gauge/GaugeContainer";
import VisualiserContainer from "./instruments/visualiser/VisualiserContainer";
import QuadrantInstrumentContainer from "./noninstruments/QuadrantInstrumentContainer";
import Visualiser2 from "./instruments/visualiser/Visualiser2";
import AddInstrument from "./noninstruments/AddInstrument";
import DeltaAssembler from "delta-processor"

// const server_root = "ws://192.168.1.115:3000";

const endpoint = "/signalk/v1";

class Instruments extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            fullState: {
                vessels: {
                    self: {}
                }
            }
        };
        const HTTPServerRoot = "http:" + this.props.server.split(":").slice(1, 10).join(":");
        this.deltaAssembler = new DeltaAssembler(HTTPServerRoot, fullState => {
            // console.log("Finalized delta: ", delta)
            this.setState({
                fullState
            })
        });

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
                "period": 1000,
                "format": "delta",
                "policy": "instant",
                "minPeriod": 1000
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
            // // console.log(message)
            this.deltaAssembler.onDelta(message);

        //     for (const subscriber of this.subscribers) {
        //         try {
        //             message.updates.forEach(update => {
        //                 update.values.forEach(value => {
        //                     subscriber.paths.forEach(subscriberPath => {
        //                         if (subscriberPath instanceof RegExp) {
        //                             if (subscriberPath.test(value.path)) {
        //                                 subscriber.onDelta(update);
        //                             }
        //                         } else if (typeof subscriberPath === "string") {
        //                             if (subscriberPath === value.path) {
        //                                 subscriber.onDelta(update);
        //                             }
        //                         } else {
        //                             throw new Error(`Encountered subscriber path ${subscriberPath} of unknown type!`);
        //                         }
        //                     })
        //                 })
        //             });
        //
        //         } catch (err) {
        //             console.debug("Instruments.js onMessage error: ", err, message)
        //         }
        //     }
        };
        // this.resetWebsocket();
    }

    // pathRegexToHTTP = path => "/".concat(path.toString()
    //     .replace(/([\\+.])+/g, "/")
    //     .concat("/"))
    //     .replace(/\/+/g, "/")
    //
    // pathRegexToSignalkPath = path => this.pathRegexToHTTP(path)
    //     .replace(/\/$/, "")
    //     .replace(/^\//, "")
    //     .replace(/\//g, ".")
    //
    //
    // giveMetadata(paths, onMetadata) {
    //     const HTTPServerRoot = "http:" + this.props.server.split(":").slice(1, 10).join(":");
    //     const API = HTTPServerRoot + endpoint;
    //
    //     paths.forEach(path => {
    //         fetch(API + "/api/vessels/self" + this.pathRegexToHTTP(path) + "meta")
    //             .then(response => response.json())
    //             .then(data => {
    //                 // console.log("asdasdasd", data);
    //                 return onMetadata(data, this.pathRegexToSignalkPath(path));
    //             })
    //             .catch(console.error)
    //     })
    // }

    // componentDidUpdate() {
    //     this.resetWebsocket();
    //     this.componentDidMount();
    // }

    // getSnapshotBeforeUpdate(prevProps) {
    //     if (this.ws.readyState) {
    //         this.ws.send(JSON.stringify({
    //             "context": "*",
    //             "unsubscribe": [{
    //                 "path": "*"
    //             }]
    //         }))
    //     }
    //     this.ws.close(1000, `Changing server from ${prevProps.server}`)
    //     return null;
    // }

    render () {
        const subscribe = (paths, onDelta, onMetadata) => {
            this.subscribers.push({paths, onDelta, onMetadata})
            // this.giveMetadata(paths, onMetadata);
        };


        const instruments = [
            // {
            //     type: "single",
            //     instruments: [
            //         {
            //             component: TridataContainer,
            //             additionalProps: {
            //                 paths: ["environment.depth.belowTransducer",
            //                     "navigation.speedOverGround",
            //                     "performance.polarSpeed",
            //                     "navigation.trip.log"
            //                 ],
            //             }
            //         },
            //     ]
            // },
            {
                type: "single",
                instruments: [
                    {
                        component: WindContainer,
                        additionalProps: {
                            // paths: [
                            //     "environment.wind.speedTrue",
                            //     "environment.wind.speedApparent",
                            //     "environment.wind.angleTrueWater",
                            //     "environment.wind.angleApparent"
                            // ],
                        }
                    }
                ]
            },
            // {
            //     type: "quadrant",
            //     instruments: [
            //         {
            //             component: GaugeContainer,
            //             additionalProps: {
            //                 path: "environment.depth.belowTransducer",
            //                 // path:
            //             }
            //         },
            //         {
            //             component: GaugeContainer,
            //             additionalProps: {
            //                 path: "environment.wind.speedTrue"
            //             }
            //         },
            //         {
            //             component: GaugeContainer,
            //             additionalProps: {
            //                 path: "performance.polarSpeedRatio"
            //             }
            //         },
            //         {
            //             component: GaugeContainer,
            //             additionalProps: {
            //                 path: "steering.rudderAngle"
            //             }
            //         }
            //     ]
            // },
            //
            // {
            //     type: "single",
            //     instruments: [
            //         {
            //             component: VisualiserContainer,
            //             additionalProps: {
            //                 path: "environment.depth.belowTransducer",
            //                 ranges: [5, 10, 20, 40, 100],
            //                 numberOfPointsToShow: 200,
            //                 negate: true,
            //                 upperBound: 100,
            //                 lowerBound: 0,
            //                 legend: "Depth",
            //                 unit: "m",
            //                 trendlinePeriod: 50,
            //                 trendline: true
            //             }
            //         }
            //     ]
            // },
            // {
            //     type: "single",
            //     instruments: [
            //         {
            //             component: VisualiserContainer,
            //             additionalProps: {
            //                 path: "environment.wind.speedTrue",
            //                 ranges: [10, 20, 50],
            //                 numberOfPointsToShow: 200,
            //                 negate: false,
            //                 upperBound: 50,
            //                 lowerBound: 0,
            //                 legend: "Wind, speed true",
            //                 unit: "m/s",
            //                 trendlinePeriod: 20,
            //                 trendline: true
            //             }
            //         }
            //     ]
            // },
        ];

        return (
            <div className="flexbox-container">
                {instruments.map((instrument, index) => {
                    if (instrument.type === "single") {
                        const component = instrument.instruments[0];
                        // const paths = component.addi

                        return <SingleInstrumentContainer
                            animate={this.props.animation}
                            key={index}
                            darkMode={this.props.darkMode}
                            colors={this.props.colors}
                            children={component.component}
                            // callback={subscribe}
                            data={this.state.fullState}
                            additionalProps={component.additionalProps}
                            resizeDebounce={0}
                        />;
                    } else if (instrument.type === "quadrant") {
                        return <QuadrantInstrumentContainer
                            animate={this.props.animation}
                            key={index}
                            darkMode={this.props.darkMode}
                            colors={this.props.colors}
                            children={instrument.instruments}
                            callback={subscribe}
                            resizeDebounce={0}
                        />;

                    }


                    }
                )}
            </div>
        );
    }

}

export default Instruments
