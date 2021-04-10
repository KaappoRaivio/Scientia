import React, { useEffect, useState } from "react";
import SettingsDialog from "../skeletons/SettingsDialog";
import StatusBar from "../statusbar/StatusBar";
import Instruments from "../instruments/Instruments";
import Logo from "../logo/Logo";
import Done from "../../assets/done.svg";
import Wrench from "../../assets/wrench.svg";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { settingsPaneOpen } from "../../redux/actions/actions";

const Main = ({ parentStyle, colors, instruments, signalkState, connectionStatus, updateInstruments }) => {
	const dispatch = useDispatch();
	const [layoutEditingEnabled, setLayoutEditingEnabled] = useState(false);
	// const [settingsPaneOpen, setSettingsPaneOpen] = useState(false);
	// const [settings, setSettings] = useState(getInitialSettings());
	const settings = useSelector(state => state.settings);

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (instruments.length === 0) setLayoutEditingEnabled(true);
		}, 1000);

		return () => clearTimeout(timeout);
	}, [instruments]);

	return (
		// <div>main</div>
		<div className="instruments" style={parentStyle}>
			<SettingsDialog appElement={Main} />
			<StatusBar signalkState={signalkState} socketStatus={connectionStatus} colors={colors} darkMode={false} onLogout={console.log} />
			<Instruments
				settings={settings}
				colors={colors}
				instruments={instruments}
				onInstrumentChanged={console.log}
				layoutEditingEnabled={layoutEditingEnabled}
				signalkState={signalkState}
			/>
			<div className="open-menu with-shadow">
				<button className="open-menu-wrapper" onClick={() => dispatch(settingsPaneOpen(true))}>
					configure
				</button>
				<ToggleLayoutEditing
					editingEnabled={layoutEditingEnabled}
					onChange={newValue => {
						console.log(newValue);
						setLayoutEditingEnabled(newValue);
					}}
				/>
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
