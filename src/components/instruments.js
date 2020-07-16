import React from "react";

import "./instruments.css"
import "./noninstruments/quadrandinstrumentcontainer.css"

import SingleInstrumentContainer from "./noninstruments/SingleInstrumentContainer";
import QuadrantInstrumentContainer from "./noninstruments/QuadrantInstrumentContainer";
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

        // this.ws = new WebSocket(serverAddress + endpoint + "/stream/?subscribe=none");
        this.initializeWebsocket();
    }

    initializeWebsocket () {
        try {
            this.ws.close();
        } catch (err) {
            console.error(err);
        }

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


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.settings.serverAddress !== this.props.settings.serverAddress) {
            console.log("Switching!!!")
            this.initializeWebsocket();
        }
    }

    render () {


        const { animation, darkMode } = this.props.settings;
        const { colors, instruments, onInstrumentAdded, onInstrumentRemoved, layoutEditingEnabled } = this.props;

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
                                children={component.component}
                                data={this.state.fullState}
                                additionalProps={component.additionalProps}
                                resizeDebounce={0}
                                forceResize={true}
                                onRemoveClick={onInstrumentRemoved}
                                index={index}
                                layoutEditingEnabled={layoutEditingEnabled}
                            />;
                        } else if (instrument.type === "quadrant") {
                            return <QuadrantInstrumentContainer layoutEditingEnabled={layoutEditingEnabled}>
                                {[...instrument.instruments.map((quadrant, innerIndex) => {
                                    return <SingleInstrumentContainer
                                        animate={animation}
                                        darkMode={darkMode}
                                        colors={colors}
                                        children={quadrant.component}
                                        data={this.state.fullState}
                                        additionalProps={quadrant.additionalProps}
                                        resizeDebounce={0}
                                        forceResize={true}
                                        onRemoveClick={index => {
                                            console.log(index, instrument.instruments);
                                            // instrument.instruments = [];
                                            instrument.instruments = instrument.instruments.slice(0, index)
                                                .concat({
                                                    component: AddInstrument,
                                                    additionalProps: {
                                                        onInstrumentAdded: newInstrument => {
                                                            console.log(newInstrument)
                                                            instrument.instruments[index] = newInstrument.instruments[0];
                                                        }
                                                    }
                                                })
                                                .concat(instrument.instruments.slice(index + 1));
                                            this.forceUpdate();
                                        }}
                                        index={innerIndex}
                                        layoutEditingEnabled={layoutEditingEnabled}
                                    />;
                                }),
                                ...[...Array(layoutEditingEnabled ? 4 - instrument.instruments.length : 0).fill(0)].map((_, index) =>
                                    <SingleInstrumentContainer
                                        animate={animation}
                                        darkMode={darkMode}
                                        colors={colors}
                                        children={AddInstrument}
                                        data={this.state.fullState}
                                        additionalProps={{onInstrumentAdded: newInstrument => {
                                                // instrument.instruments[4 - instrument.instruments.length + index] = newInstrument;
                                                instrument.instruments.push(newInstrument.instruments[0])
                                                console.log(newInstrument, index, instrument.instruments)
                                            }}}
                                        resizeDebounce={0}
                                        forceResize={true}
                                        onRemoveClick={onInstrumentRemoved}
                                        index={index}
                                        layoutEditingEnabled={false}
                                    />
                                )]}
                            </QuadrantInstrumentContainer>;
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

export default Instruments
