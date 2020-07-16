import React, {useState} from 'react';
import './flat-remix.css';

import './App.css';

import "react-vis/dist/style.css";
import "chartist/dist/chartist.css";


import Instruments from "./components/instruments"
// import MySidebar from "./components/mySidebar";
import Logo from "./components/Logo";
import MyModal from "./components/MyModal";
import WindContainer from "./components/instruments/wind/WindContainer";
import CompassContainer from "./components/instruments/compass/CompassContainer";
import TridataContainer from "./components/instruments/tridata/TridataContainer";
import GaugeContainer from "./components/instruments/gauge/GaugeContainer";
// import AddInstrument from "./components/noninstruments/AddInstrument";

import Wrench from "./assets/wrench.svg"
import Done from "./assets/done.svg"

// if (process.env.NODE_ENV !== "production") {
    // const {whyDidYouUpdate} = require("why-did-you-update");
    // whyDidYouUpdate(React);
// }

class App extends React.Component {
    constructor(props) {
        super(props);

        let url = window.location.href;
        // let ws = "ws:" + url.split(":")[1] + ":3000"
        let ws = "ws://192.168.1.151:3000"
        this.state = {
            layoutEditingEnabled: false,
            settingsPaneOpen: false,

            settings: {
                serverAddress: ws,
                darkMode: false,
                animation: false,
                animationsAccordingToChargingStatus: true
            },

            instruments: getInstruments()
        };
    }

    getColors () {
        if (this.state.settings.darkMode) {
            return {
                primary: "#f00",
                secondary: "#444",
                background: "#000",

                accent1: "rgb(0, 50, 150)",
                accent2: "rgb(0, 50, 220)",

                valueNormal: "rgba(0, 0, 0,0)",
                valueAlert: "#dd0",
                valueWarn: "#d80",
                valueAlarm: "#d00",
                valueEmergency: "#f0f"
            }
        } else {
            return {
                primary: "#000",
                secondary: "#000",
                background: "#fff",

                accent1: "rgb(0, 50, 150)",
                accent2: "rgb(0, 50, 220)",


                valueNormal: "rgba(0, 0, 0, 0)",
                // valueNormal: "lightgreen",
                valueAlert: "yellow",
                valueWarn: "orange",
                valueAlarm: "red",
                valueEmergency: "purple"
            }
        }
    }

    login = async () => {
        const responsePromise = await fetch("http://localhost:3000/signalk/v1/auth/login", {
            method: "POST",
            // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                password: "admin",
                username: "admin"
            })
        });
        console.log(responsePromise)
        return responsePromise;
    }

    componentDidMount() {
        // const requestOptions = {
        //     method: 'POST',
        // };

        console.log("asd")
        this.login()
            .then(response => {
                fetch("http://localhost:3000/signalk/v1/applicationData/admin/testi/1.0/", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        key: "value"
                    })
                })
                    .then(console.log)
                    .catch(console.log)
            })
            .catch(console.log)





        if (this.state.settings.animationsAccordingToChargingStatus) {
            navigator
                .getBattery()
                .then(battery => {
                    this.setState({animation: battery.charging})
                })
                .catch(console.error);
        }
    }

    render() {
        const colors = this.getColors();

        const onSetSettingsPaneOpen = (open) => {
            this.setState({ settingsPaneOpen: open });
        }

        const onSettingsChange = (newSettings) => {
            // console.log(newSettings)
            this.setState({
                settings: newSettings,
            })
        }

        const parentStyle = {
            stroke: colors.primary,
            fill: colors.background,
            color: colors.primary,
            backgroundColor: colors.background
        }

        const getInitialSettings = () => ({
            animation: this.state.settings.animation,
            darkMode: this.state.settings.darkMode,
            serverAddress: this.state.settings.serverAddress,
            animationsAccordingToChargingStatus: this.state.settings.animationsAccordingToChargingStatus,
        })

        const onInstrumentAdded = instrument => {
            this.setState(oldState => ({
                instruments: oldState.instruments.concat(instrument)
            }))
        }

        const onInstrumentRemoved = index => {
            console.log("Instrument removed", index)
            this.setState(oldState => ({
                instruments: oldState.instruments.slice(0, index).concat(oldState.instruments.slice(index + 1))
            }))
            console.log(this.state)
        }

        // return (
        //     <div className="instruments" style={parentStyle}>
        //         <MyModal isModalOpen={this.state.settingsPaneOpen}
        //             requestClosing={() => onSetSettingsPaneOpen(false)}
        //             initialValues={getInitialSettings()}
        //             onSettingsUpdate={onSettingsChange}
        //             colors={colors}
        //             appElement={this}
        //         />
        //         <Instruments settings={this.state.settings} colors={colors} instruments={this.state.instruments} onInstrumentAdded={onInstrumentAdded} onInstrumentRemoved={onInstrumentRemoved} layoutEditingEnabled={this.state.layoutEditingEnabled} />
        //         <div className="open-menu with-shadow">
        //             <button className="open-menu-wrapper"
        //                 onClick={() => onSetSettingsPaneOpen(true)}>
        //                 configure
        //             </button>
        //             {/*<button className="open-menu-wrapper"*/}
        //             {/*        onClick={() => onSetSettingsPaneOpen(true)}>*/}
        //             {/*    configureasd*/}
        //             {/*</button>*/}
        //             <ToggleLayoutEditing editingEnabled={this.state.layoutEditingEnabled} onChanged={layoutEditingEnabled => this.setState({layoutEditingEnabled})}/>
        //         </div>
        //         <Logo />
        //     </div>
        // );
        return <div></div>
    }
}

const ToggleLayoutEditing = ({ editingEnabled, onChanged }) => {
    return <div onClick={() => onChanged(!editingEnabled)} className="configure-layout-wrapper">
        <img className="configure-layout" src={editingEnabled ? Done : Wrench} alt="enable layout configuration" width="auto"/>
    </div>
}

const getInstruments = () => {
    return [];
    return [
        {
            type: "quadrant",
            instruments: [
                {
                    component: WindContainer,
                    additionalProps: {}
                },
                {
                    component: CompassContainer,
                    additionalProps: {}
                },
                {
                    component: TridataContainer,
                    additionalProps: {
                        paths: [
                            "environment.depth.belowTransducer",
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
            type: "quadrant",
            instruments: [
                {
                    component: WindContainer,
                    additionalProps: {}
                },
                {
                    component: CompassContainer,
                    additionalProps: {}
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
            ]
        },
        {
            type: "single",
            instruments: [
                {
                    component: GaugeContainer,
                    additionalProps: {
                        path: "performance.polarSpeedRatio"
                    }
                }
            ]
        }
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
}


export default App;
