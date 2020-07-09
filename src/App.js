import React from 'react';
import './flat-remix.css';
// import "@patternfly/patternfly/patternfly.css"

import './App.css';

// import Modal from "react-modal";

import Instruments from "./components/instruments"
// import MySidebar from "./components/mySidebar";
import Logo from "./components/Logo";
import MyModal from "./components/MyModal";

if (process.env.NODE_ENV !== "production") {
    // const {whyDidYouUpdate} = require("why-did-you-update");
    // whyDidYouUpdate(React);
}

class App extends React.Component {
    constructor(props) {
        super(props);

        let url = window.location.href;
        let ws = "ws:" + url.split(":")[1] + ":3000"

        this.state = {
            settingsPaneOpen: false,

            settings: {
                serverAddress: ws,
                darkMode: false,
                animation: false,
                animationsAccordingToChargingStatus: true
            },
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


    componentDidMount() {
        if (this.state.settings.animationsAccordingToChargingStatus) {
            navigator
                .getBattery()
                .then(battery => {
                    // // console.log(battery);
                    // this.setState({animation: battery.charging})
                })
                .catch(console.error);
        }
    }

    render() {
        const colors = this.getColors();

        const onSetSettingsPaneOpen = (open) => {
            this.setState({ settingsPaneOpen: open });
        }
        //
        const onSettingsChange = (newSettings) => {
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
            animationsAccordingToChargingStatus: this.state.settings.animationsAccordingToChargingStatus
        })

        return (
            <div className="instruments" style={parentStyle}>
                <MyModal isModalOpen={this.state.settingsPaneOpen}
                    requestClosing={() => onSetSettingsPaneOpen(false)}
                    initialValues={getInitialSettings()}
                    onSettingsUpdate={onSettingsChange}
                    colors={colors}
                    appElement={this}
                />
                <Instruments settings={this.state.settings} colors={colors} />
                <div className="open-menu with-shadow">
                    <button className="open-menu-wrapper"
                        onClick={() => onSetSettingsPaneOpen(true)}>
                        configure
                    </button>
                </div>
                <Logo />
            </div>
        );
    }
}


export default App;
