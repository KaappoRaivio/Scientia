import React from 'react';
import './flat-remix.css';
// import "@patternfly/patternfly/patternfly.css"

import './App.css';

import Modal from "react-modal";

import Instruments from "./components/instruments"
import MySidebar from "./components/mySidebar";
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
            serverAddress: ws,

            darkMode: false,
            animation: false
        };
    }

    getColors () {
        if (this.state.darkMode) {
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
        navigator
            .getBattery()
            .then(battery => {
                // // console.log(battery);
                // this.setState({animation: battery.charging})
            })
            .catch(console.error);
    }

    render() {
        const colors = this.getColors();

        const onSetSettingsPaneOpen = (open) => {
            this.setState({ settingsPaneOpen: open });
        }
        //
        const onSettingsChange = (newSettings) => {
            // // console.log(newSettings)
            this.setState({
                serverAddress: newSettings.serverAddress,
                darkMode: newSettings.darkMode,
                animation: newSettings.animate
            })
        }

        const parentStyle = {
            stroke: colors.primary,
            fill: colors.background,
            color: colors.primary,
            backgroundColor: colors.background
        }

        const getInitialSettings = () => ({
            animate: this.state.animation,
            darkMode: this.state.darkMode,
            serverAddress: this.state.serverAddress
        })

        return (
            <div className="instruments" style={parentStyle}>
                {/*<MySidebar sidebarOpen={this.state.settingsPaneOpen}*/}
                {/*    initialAddress={this.state.serverAddress}*/}
                {/*    initialDarkMode={this.state.darkMode}*/}
                {/*    initialAnimation={this.state.animation}*/}
                {/*    onSetSettingsPaneOpen={onSetSettingsPaneOpen}*/}
                {/*    onSettingsChange={onSettingsChange}*/}
                {/*    colors={colors}/>*/}
                <MyModal isModalOpen={this.state.settingsPaneOpen}
                    requestClosing={() => onSetSettingsPaneOpen(false)}
                    initialValues={getInitialSettings()}
                    onSettingsUpdate={onSettingsChange}
                    colors={colors}
                    appElement={this}
                />
                <Instruments server={this.state.serverAddress} darkMode={this.state.darkMode} colors={colors} animation={this.state.animation}/>
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
