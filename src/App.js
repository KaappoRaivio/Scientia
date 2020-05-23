import React from 'react';
import './flat-remix.css';
import './App.css';
import "./hamburgers.css"


import Instruments from "./components/instruments"
import Sidebar from "react-sidebar";
import Switch from "react-switch";


class App extends React.Component {
    constructor(props) {
        super(props);

        let url = window.location.href;
        let ws = "ws:" + url.split(":")[1] + ":3000"

        this.state = {
            sidebarOpen: true,
            // address: "ws://192.168.43.232:3000",
            // server: "ws://192.168.43.232:3000"
            address: ws,
            server: ws,

            darkMode: false
        };
        // setInterval(() => {
        //     this.setState(oldState => {
        //         return {darkMode: !oldState.darkMode}
        //     })
        // }, 1000)



        console.log(window.location.href)
        this.setColors()
    }

    setColors () {
        if (this.state.darkMode) {
            this.colors = {
                primary: "#f00",
                background: "#000"
            }
        } else {
            this.colors = {
                primary: "#777",
                background: "#fff"
            }
        }
    }
    componentDidMount() {
        // mDnsSd.discover({name: "_signalk-ws._tcp"})
        // bonjour.find({name: "_signalk-ws._tcp"}, service => {
        //     console.log(service);
        // })
        // mDnsSd.ondata = packet => {
        //     console.log(JSON.stringify(packet))
        // }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.setColors()
    }

    render() {
        const onSetSidebarOpen = (open) => {
            this.setState({ sidebarOpen: open });
        }

        const onColourPalleteChange = (night) => {
            this.setState({darkMode: night});
        }

        const onAddressChangeConfirm = () => {
            this.setState((state) => {
                console.log("Changing address!")
                return {
                    server: state.address,
                    sidebarOpen: false
                }
            })
        }


        return (
            <div className="instruments" style={{color: this.colors.primary, backgroundColor: this.colors.background}}>
                <Sidebar sidebar={
                    <div className="sidebar-wrapper">
                        <div className="server-address-wrapper with-shadow">
                            <div className="server-address">
                                Server address
                            </div>
                            <div className="addressInput">
                                <input className="address" value={this.state.address} onChange={(event) => {
                                    this.setState({address: event.target.value});
                                    event.preventDefault();
                                }}/>
                                <button className="button confirm" onClick={onAddressChangeConfirm}>OK</button>
                            </div>
                        </div>
                        <div className="color-scheme server-address-wrapper with-shadow">
                            <div className="server-address">
                                Colour pallette
                            </div>
                            <Switch
                                checked={this.state.darkMode}
                                onChange={onColourPalleteChange}
                                onColor="#86d3ff"
                                onHandleColor="#2693e6"
                                handleDiameter={30}
                                uncheckedIcon={false}
                                checkedIcon={false}
                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                height={20}
                                width={48}
                            />
                        </div>
                    </div>}
                    open={this.state.sidebarOpen}
                    onSetOpen={onSetSidebarOpen}
                    styles={sidebarStyles}>
                </Sidebar>
                <Instruments server={this.state.server} darkMode={this.state.darkMode}/>
                <div className="open-menu with-shadow">
                    <button className="open-menu-wrapper"
                        onClick={() => onSetSidebarOpen(true)}>
                        configure
                    </button>
                </div>

            </div>
        );
    }
}

const sidebarStyles = {
    sidebar: {
        width: 400,
        background: "white",
        position: "fixed"
    }
}

export default App;
