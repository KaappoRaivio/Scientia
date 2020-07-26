import React from 'react';
import './flat-remix.css';

import './App.css';

import "react-vis/dist/style.css";
import "chartist/dist/chartist.css";


import Instruments from "./components/instruments"
import Logo from "./components/Logo";
import MyModal from "./components/MyModal";

import Wrench from "./assets/wrench.svg"
import Done from "./assets/done.svg"
import Package from "../package.json"

export const appName = Package.name;
export const appVersion = Package.version;

class App extends React.Component {
    constructor(props) {
        super(props);

        let url = window.location.href;
        let ws = "ws:" + url.split(":")[1] + ":3000"
        // let ws = "ws://192.168.1.151:3000"
        this.state = {
            layoutEditingEnabled: false,
            settingsPaneOpen: false,

            settings: {
                serverAddress: ws,
                darkMode: false,
                animation: false,
                animationsAccordingToChargingStatus: true,

                username: "user",
                password: "user"
            },

            instruments: []
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

    login = () => {
        const { username, password } = this.state.settings;

        return fetch("/signalk/v1/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username, password})
        }).then(response => {
            if (response.ok) {
                console.log("Successfully logged in!");
                return response
            } else {
                throw new Error(`There was a problem with login: ${response.status}`)
            }
        });
    }

    componentDidMount() {
        this.login()
            .then(() => {
                getInstruments(this.state.settings.username)
                    .then(instruments => {
                        console.log(instruments)
                        this.setState({instruments});
                    })
                // getInstruments("paska")
                //     .then(instruments => {
                //         saveInstruments(this.state.settings.username, instruments)
                //             .then(response => console.log("Asdasd", response))
                //     })
            })
            // .then(response => {

            //         .catch(console.error)
            //     // fetch("/signalk/v1/applicationData/user/appname/1.0/test", {
            //     //     // credentials: 'include',
            //     // })
            //     //     .then(response => response.json())
            //     //     .then(console.log)
            // })
            // .catch(console.error)


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
            }), () => {
                saveInstruments(this.state.settings.username, this.state.instruments)
            })
        }

        const onInstrumentRemoved = index => {
            console.log("Instrument removed", index)
            this.setState(oldState => ({
                instruments: oldState.instruments.slice(0, index).concat(oldState.instruments.slice(index + 1))
            }), () => {
                saveInstruments(this.state.settings.username, this.state.instruments)
            })
            console.log(this.state)
        }

        const onInstrumentChanged = (index, instrument) => {
            console.log("Instrument changed", index, instrument)
            this.setState(oldState => ({
                instruments: oldState.instruments.slice(0, index)
                    .concat(instrument)
                    .concat(oldState.instruments.slice(index + 1))
            }), () => {
                saveInstruments(this.state.settings.username, this.state.instruments)
            })
        }

        return (
            <div className="instruments" style={parentStyle}>
                <MyModal isModalOpen={this.state.settingsPaneOpen}
                    requestClosing={() => onSetSettingsPaneOpen(false)}
                    initialValues={getInitialSettings()}
                    onSettingsUpdate={onSettingsChange}
                    colors={colors}
                    appElement={this}
                />
                <Instruments settings={this.state.settings}
                             colors={colors}
                             instruments={this.state.instruments}
                             onInstrumentAdded={onInstrumentAdded}
                             onInstrumentRemoved={onInstrumentRemoved}
                             onInstrumentChanged={onInstrumentChanged}
                             layoutEditingEnabled={this.state.layoutEditingEnabled} />
                <div className="open-menu with-shadow">
                    <button className="open-menu-wrapper"
                        onClick={() => onSetSettingsPaneOpen(true)}>
                        configure
                    </button>
                    {/*<button className="open-menu-wrapper"*/}
                    {/*        onClick={() => onSetSettingsPaneOpen(true)}>*/}
                    {/*    configureasd*/}
                    {/*</button>*/}
                    <ToggleLayoutEditing editingEnabled={this.state.layoutEditingEnabled} onChanged={layoutEditingEnabled => this.setState({layoutEditingEnabled})}/>
                </div>
                <Logo />
            </div>
        );
    }
}

const ToggleLayoutEditing = ({ editingEnabled, onChanged }) => {
    return <div onClick={() => onChanged(!editingEnabled)} className="configure-layout-wrapper">
        <img className="configure-layout" src={editingEnabled ? Done : Wrench} alt="enable layout configuration" width="auto"/>
    </div>
}

const saveInstruments = (username, instruments) => {
    fetch(`/signalk/v1/applicationData/${username}/${appName}/${appVersion}/layout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(instruments)
    })
        .then(response => response.ok ? console.log("Saved instruments successfully!") : console.log("There was a problem saving the insruments: " + response.status))
}

const getInstruments = (username) => {
    return fetch(`/signalk/v1/applicationData/${username}/${appName}/${appVersion}/layout`)
        .then(response => {
            console.log(response)
            if (response.ok) {
                return response.json();

            } else {
                throw new Error("Problem with response: " + response.status);
            }
        })
        .catch(error => [
            {
                type: "quadrant",
                instruments: [
                    // {
                    //     component: WindContainer,
                    //     additionalProps: {}
                    // },
                    {
                        component: "CompassContainer",
                        additionalProps: {}
                    },
                    {
                        component: "TridataContainer",
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
                        component: "GaugeContainer",
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
                        component: "WindContainer",
                        additionalProps: {}
                    },
                    {
                        component: "CompassContainer",
                        additionalProps: {}
                    },
                    {
                        component: "TridataContainer",
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
                        component: "GaugeContainer",
                        additionalProps: {
                            path: "performance.polarSpeedRatio"
                        }
                    }
                ]
            }
    ]);
}


export default App;
