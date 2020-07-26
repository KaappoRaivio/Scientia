import React from "react";

import "./instruments.css"
import "./noninstruments/quadrandinstrumentcontainer.css"

import SingleInstrumentContainer from "./noninstruments/SingleInstrumentContainer";
import QuadrantInstrumentContainer from "./noninstruments/QuadrantInstrumentContainer";
import AddInstrument from "./noninstruments/AddInstrument";
import DeltaAssembler from "delta-processor"
import WindContainer from "./instruments/wind/WindContainer";
import CompassContainer from "./instruments/compass/CompassContainer";
import TridataContainer from "./instruments/tridata/TridataContainer";
import GaugeContainer from "./instruments/gauge/GaugeContainer";
import VisualiserContainer from "./instruments/visualiser/VisualiserContainer";

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

        // this.ws = new WebSocket(serverAddress + endpoint + "/stream/?subscribe=none");
    }

    initializeWebsocket () {
        try {
            this.ws.close();
        } catch (ignored) {}

        this.ws = new WebSocket(this.props.settings.serverAddress + endpoint + "/stream/?subscribe=none");
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
            this.deltaAssembler.onDelta(message);
        };

        this.ws.onclose = (event) => {
            console.log(event)
            try {
                this.ws.send(JSON.stringify({
                        context: "vessels.self",
                        unsubscribe : [
                            "*"
                        ]
                    })
                )
            } catch (error) {}
        }
    }
    componentDidMount() {
        this.initializeWebsocket();
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.settings.serverAddress !== this.props.settings.serverAddress) {
            console.log("Switching!!!")
            this.initializeWebsocket();
        }
    }

    render () {


        const { animation, darkMode } = this.props.settings;
        const { colors, instruments, onInstrumentAdded, onInstrumentRemoved, onInstrumentChanged, layoutEditingEnabled } = this.props;

        return (
            <div className="flexbox-container">
                {
                    instruments.map((instrument, index) => {
                        if (instrument.type === "single") {
                            const component = instrument.instruments[0];

                            return <SingleInstrumentContainer
                                animate={animation}
                                darkMode={darkMode}
                                colors={colors}
                                children={stringToClass(component.component)}
                                data={this.state.fullState}
                                additionalProps={component.additionalProps}
                                resizeDebounce={0}
                                forceResize={true}
                                onRemoveClick={onInstrumentRemoved}
                                index={index}
                                layoutEditingEnabled={layoutEditingEnabled}
                            />;
                        } else if (instrument.type === "quadrant") {
                            return <QuadrantInstrumentContainer
                                layoutEditingEnabled={layoutEditingEnabled}
                                onInstrumentChanged={onInstrumentChanged}
                                index={index}
                                colors={colors}
                                animation={animation}
                                data={instrument.instruments}
                                >
                                {[
                                    ...instrument.instruments.map((quadrant, innerIndex) => {
                                        // console.log(quadrant, stringToClass(quadrant.component))
                                        return <SingleInstrumentContainer
                                            animate={animation}
                                            darkMode={darkMode}
                                            colors={colors}
                                            children={stringToClass(quadrant.component)}
                                            data={this.state.fullState}
                                            additionalProps={quadrant.additionalProps}
                                            resizeDebounce={0}
                                            forceResize={true}
                                            onRemoveClick={_ => {
                                                console.log(index, innerIndex, _, instrument.instruments);

                                                let newInstruments = instrument.instruments.slice(0, innerIndex).concat(instrument.instruments.slice(innerIndex + 1))
                                                console.log(newInstruments)

                                                onInstrumentChanged(index, {
                                                    type: "quadrant",
                                                    // instruments: [],
                                                    instruments: newInstruments
                                                    // instruments: instrument.instruments.slice(0, innerIndex)
                                                    //     .concat({
                                                    //         component: "AddInstrument",
                                                    //         additionalProps: {
                                                    //             onInstrumentAdded: newInstrument => {
                                                    //                 // console.log(newInstrument)
                                                    //                 // instrument.instruments[index] = newInstrument.instruments[0];
                                                    //             }
                                                    //         }
                                                    //     })
                                                    //
                                                        // .concat(instrument.instruments.slice(index + 1))
                                                    }
                                                );
                                            }}
                                            index={innerIndex}
                                            layoutEditingEnabled={layoutEditingEnabled}
                                        />;
                                    })]}
                            </QuadrantInstrumentContainer>;
                        } else {
                            return <div>Unknown instrument type {instrument.type}</div>
                        }
                    }
                )}

                {layoutEditingEnabled &&
                    <SingleInstrumentContainer
                        children={AddInstrument}
                        data={this.state.fullState}
                        additionalProps={{onInstrumentAdded}}
                        animate={animation}
                        darkMode={darkMode}
                        colors={colors}
                        forceResize={true}
                        layoutEditingEnabled={false}
                    />}
            </div>
        );
    }
}

export const stringToClass = string => ({
    "CompassContainer": CompassContainer,
    "WindContainer": WindContainer,
    "TridataContainer": TridataContainer,
    "GaugeContainer": GaugeContainer,
    "VisualiserContainer": VisualiserContainer,
    "AddInstrument": AddInstrument
}[string])

export default Instruments
