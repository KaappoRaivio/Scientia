import React from 'react';
import './flat-remix.css';
import './App.css';
import "./hamburgers.css"


import Instruments from "./components/instruments"
import Sidebar from "react-sidebar";



class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebarOpen: false,
            address: "ws://192.168.43.232:3000",
            server: "ws://192.168.43.232:3000"
        };
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

    render() {
        const onSetSidebarOpen = (open) => {
            this.setState({ sidebarOpen: open });
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
            <div className="instruments">
                <Sidebar sidebar={
                        <div className="addressInput with-shadow">
                            <input className="address" value={this.state.address} onChange={(event) => {
                                this.setState({address: event.target.value});
                                event.preventDefault();
                            }}/>
                            <button className="button confirm" onClick={onAddressChangeConfirm}>OK</button>
                        </div>}
                    open={this.state.sidebarOpen}
                    onSetOpen={this.onSetSidebarOpen}
                    styles={sidebarStyles}>
                </Sidebar>
                <Instruments server={this.state.server}/>
                <div className="open-menu with-shadow">
                    <button className="open-menu-wrapper"
                        onClick={() => onSetSidebarOpen(true)}>
                        configure
                    </button>
                    {/*configure*/}
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
