import React from 'react';
import './flat-remix.css';
import './App.css';


import Instruments from "./components/instruments"
import MySidebar from "./components/mySidebar";
import Logo from "./components/Logo";

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
            sidebarOpen: false,
            serverAddress: ws,

            darkMode: false,
            animation: true
        };
    }

    getColors () {
        if (this.state.darkMode) {
            return {
                primary: "#f00",
                secondary: "#222",
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
                console.log(battery);
                this.setState({animation: battery.charging})
            })
            .catch(console.error);
    }

    render() {
        const colors = this.getColors();

        const onSetSidebarOpen = (open) => {
            this.setState({ sidebarOpen: open });
        }

        const onSettingsChange = (newSettings) => {
            console.log(newSettings)
            this.setState({
                serverAddress: newSettings.address,
                darkMode: newSettings.darkMode,
                animation: newSettings.animation
            })
        }

        const parentStyle = {
            stroke: colors.primary,
            fill: colors.background,
            color: colors.primary,
            backgroundColor: colors.background
        }

        return (
            <div className="instruments" style={parentStyle}>
                <MySidebar sidebarOpen={this.state.sidebarOpen} initialAddress={this.state.serverAddress} initialDarkMode={this.state.darkMode} initialAnimation={this.state.animation} onSetSidebarOpen={onSetSidebarOpen} onSettingsChange={onSettingsChange} colors={colors}/>
                <Instruments server={this.state.serverAddress} darkMode={this.state.darkMode} colors={colors} animation={this.state.animation}/>
                <div className="open-menu with-shadow">
                    <button className="open-menu-wrapper"
                        onClick={() => this.setState({sidebarOpen: true})}>
                        configure
                    </button>
                </div>
                <Logo />
            </div>
        );
    }
}


export default App;
