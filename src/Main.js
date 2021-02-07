import React, { useEffect, useState } from "react";
import SettingsDialog from "./components/skeletons/SettingsDialog";
import StatusBar from "./components/statusbar/StatusBar";
import Instruments from "./components/instruments/Instruments";
import Logo from "./components/logo/Logo";
import Done from "./assets/done.svg";
import Wrench from "./assets/wrench.svg";

const getInitialSettings = () => ({
	animation: false,
	darkMode: false,
	serverAddress: "hello, world!",
	animationsAccordingToChargingStatus: true,
});

const Main = ({ parentStyle, colors, instruments, signalkState, connectionStatus }) => {
	const [layoutEditingEnabled, setLayoutEditingEnabled] = useState(false);
	const [settingsPaneOpen, setSettingsPaneOpen] = useState(false);

	useEffect(() => {
		setLayoutEditingEnabled(instruments.length === 0);
	}, [instruments]);

	return (
		// <div>main</div>
		<div className="instruments" style={parentStyle}>
			<SettingsDialog
				isModalOpen={settingsPaneOpen}
				requestClosing={() => setSettingsPaneOpen(false)}
				initialValues={getInitialSettings()}
				onSettingsUpdate={console.log}
				colors={colors}
				appElement={Main}
			/>
			<StatusBar
				apiKey={""}
				signalkState={signalkState}
				socketStatus={connectionStatus}
				colors={colors}
				darkMode={false}
				onLogout={console.log}
			/>
			<Instruments
				settings={{ animation: false, darkMode: false }}
				colors={colors}
				instruments={instruments}
				onInstrumentAdded={console.log}
				onInstrumentRemoved={console.log}
				onInstrumentChanged={console.log}
				layoutEditingEnabled={layoutEditingEnabled}
				signalkState={signalkState}
			/>
			<div className="open-menu with-shadow">
				<button className="open-menu-wrapper" onClick={() => setSettingsPaneOpen(true)}>
					configure
				</button>
				<ToggleLayoutEditing editingEnabled={layoutEditingEnabled} onChange={setLayoutEditingEnabled} />
			</div>
			<Logo />
		</div>
	);
};

const ToggleLayoutEditing = ({ editingEnabled, onChange }) => {
	return (
		<div onClick={() => onChange(!editingEnabled)} className="configure-layout-wrapper">
			<img className="configure-layout" src={editingEnabled ? Done : Wrench} alt="toggle layout editing" width="auto" />
		</div>
	);
};

Main.propTypes = {};

export default Main;
