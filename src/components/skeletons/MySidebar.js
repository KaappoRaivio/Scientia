import Switch from "react-switch";
import React from "react";

import Sidebar from "react-sidebar";

import "./Sidebar.css";

class MySidebar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			address: props.initialAddress,
			darkMode: props.initialDarkMode,
			animation: props.initialAnimation,
		};
	}

	render() {
		const onColourPaletteChange = night => {
			this.setState({ darkMode: night });
		};

		const onAnimationChange = animation => {
			this.setState({ animation: animation });
		};

		const onAddressChange = event => {
			this.setState({ address: event.target.value });
			event.preventDefault();
		};

		const onConfirmButtonPress = () => {
			this.props.onSettingsChange(this.state);
			this.props.onSetSidebarOpen(false);
		};

		return (
			<Sidebar
				sidebar={
					<div className="sidebar-wrapper">
						<div className="setting with-shadow">
							<div className="setting-title">Server address</div>

							<input className="address" value={this.state.address} onChange={onAddressChange} />
						</div>

						<div className="setting with-shadow">
							<div className="setting-title">Colour palette</div>

							<div className="night-mode">
								Night mode
								<Switch
									className="sidebar-toggle-switch"
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
						</div>

						<div className="setting with-shadow">
							<div className="setting-title">Performance</div>

							<div className="night-mode">
								Animations
								<Switch
									className="sidebar-toggle-switch"
									checked={this.state.animation}
									onChange={onAnimationChange}
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
						</div>

						<button className="button confirm with-shadow" onClick={onConfirmButtonPress}>
							OK
						</button>
					</div>
				}
				open={this.props.sidebarOpen}
				onSetOpen={this.props.onSetSidebarOpen}
				styles={getSidebarStyle(this.props.colors)}>
				<div />
			</Sidebar>
		);
	}
}

const getSidebarStyle = colors => {
	return {
		sidebar: {
			width: 400,
			background: colors.background,
			color: colors.primary,
			position: "fixed",
			zIndex: 10,
		},
	};
};

export default MySidebar;
