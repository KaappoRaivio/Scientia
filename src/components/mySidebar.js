import Switch from "react-switch";
import React from "react";

import Sidebar from "react-sidebar";

import "./sidebar.css"

class MySidebar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            address: props.initialAddress,
            darkMode: props.initialDarkMode,
        }
    }

    render() {
        const onColourPaletteChange = (night) => {
            this.setState({darkMode: night});
        }

        const onAddressChange = (event) => {
            this.setState({address: event.target.value});
            event.preventDefault();
        }

        const onConfirmButtonPress = () => {
            this.props.onSettingsChange(this.state);
            this.props.onSetSidebarOpen(false);
        }


        return (
            <Sidebar sidebar={
                <div className="sidebar-wrapper">

                    <div className="setting with-shadow">
                        <div className="setting-title">
                            Server address
                        </div>

                        <input className="address" value={this.state.address} onChange={onAddressChange}/>

                    </div>

                    <div className="setting with-shadow">
                        <div className="setting-title">
                            Colour palette
                        </div>
                        <Switch
                            checked={this.state.darkMode}
                            onChange={onColourPaletteChange}
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

                    <button className="button confirm with-shadow" onClick={onConfirmButtonPress}>OK</button>

                </div>
            }
                     open={this.props.sidebarOpen}
                     onSetOpen={this.props.onSetSidebarOpen}
                     styles={sidebarStyles}>
                <div />
            </Sidebar>
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

export default MySidebar;