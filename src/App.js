import React from 'react';
import './flat-remix.css';
import './App.css';


import Instruments from "./components/instruments"
import MySidebar from "./components/mySidebar";
import Logo from "./components/Logo";

import FitText from '@kennethormandy/react-fittext'
import ScaleText from "react-scale-text";
import AutoFitTextBox from "./components/numberdisplay/AutoFitTextBox";

// import ReactFitText from "react-fittext/lib/ReactFitText";
const ReactFitText = require("react-fittext");

if (process.env.NODE_ENV !== "production") {
    const {whyDidYouUpdate} = require("why-did-you-update");
    whyDidYouUpdate(React);
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
                background: "#000",

                accent1: "rgb(0, 50, 150)",
                accent2: "rgb(0, 50, 220)"
            }
        } else {
            return {
                primary: "#000",
                background: "#fff",

                accent1: "rgb(0, 50, 150)",
                accent2: "rgb(0, 50, 220)"
            }
        }
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
                {/*<svg width={500} height={500} fill={"black"} stroke={"none"}>*/}
                {/*    <AutoFitTextBox width={100} height={100}>3.100</AutoFitTextBox>*/}
                {/*    <text y={10}>null</text>*/}
                {/*</svg>*/}
            </div>
        );
    }
}


export default App;
