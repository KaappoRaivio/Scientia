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
        const { serverAddress } = this.props.settings;
        const HTTPServerRoot = "http:" + serverAddress.split(":").slice(1, 10).join(":");
        this.deltaAssembler = new DeltaAssembler(HTTPServerRoot, fullState => this.setState({fullState}));

        this.resetWebsocket();
    }

    resetWebsocket () {
        this.ws = new WebSocket(this.props.settings.serverAddress + endpoint + "/stream/?subscribe=none");
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
                    preparePath("*"),
                ]
            }))
        };

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("moi")
            this.deltaAssembler.onDelta(message);
        };
    }

    render () {
        const instruments = [
            {
                type: "quadrant",
                instruments: [
                    {
                        component: WindContainer,
                        additionalProps: {

                        }
                    },
                    {
                        component: CompassContainer,
                        additionalProps: {

                        }
                    },
                    {
                        component: TridataContainer,
                        additionalProps: {
                            paths: ["environment.depth.belowTransducer",
                                "navigation.speedOverGround",
                                "performance.polarSpeed",
                                "navigation.trip.log"
                            ],
                        }
                    },
                    {
                        component: GaugeContainer,
                        additionalProps: {
                            path: "environment.depth.belowTransducer"
                        }
                    }
                ]
            },
            {
                type: "single",
                instruments: [
                    {
                        component: WindContainer,
                        additionalProps: {

                        }
                    }
                ]
            },
            {
                type: "single",
                instruments: [
                    {
                        component: CompassContainer,
                        additionalProps: {

                        }
                    }
                ]
            },
            {
                type: "single",
                instruments: [
                    {
                        component: TridataContainer,
                        additionalProps: {
                            paths: ["environment.depth.belowTransducer",
                                "navigation.speedOverGround",
                                "performance.polarSpeed",
                                "navigation.trip.log"
                            ],
                        }
                    },
                ]
            },
            // {
            //     type: "single",
            //     instruments: [
            //         {
            //             component: GaugeContainer,
            //             additionalProps: {
            //                 // path: "performance.polarSpeedRatio"
            //                 path: "steering.rudderAngle"
            //             }
            //         }
            //     ]
            // },
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

        const { animation, darkMode } = this.props.settings;
        const { colors } = this.props;

        return (
            <div className="flexbox-container">
                {instruments.map((instrument, index) => {
                    if (instrument.type === "single") {
                        const component = instrument.instruments[0];

                        return <SingleInstrumentContainer
                            animate={animation}
                            darkMode={darkMode}
                            colors={colors}
                            children={component.component}
                            data={this.state.fullState}
                            additionalProps={component.additionalProps}
                            resizeDebounce={0}
                            key={index}
                        />;
                    } else if (instrument.type === "quadrant") {
                        return <QuadrantInstrumentContainer
                            animate={animation}
                            darkMode={darkMode}
                            colors={colors}
                            data={this.state.fullState}
                            children={instrument.instruments}
                            resizeDebounce={0}
                            key={index}
                        />;

                    }


                    }
                )}
            </div>
        );
    }

}

export default Instruments
