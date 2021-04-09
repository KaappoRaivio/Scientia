import React, { useEffect, useState } from "react";
import SettingsDialog from "./components/skeletons/SettingsDialog";
import StatusBar from "./components/statusbar/StatusBar";
import Instruments from "./components/instruments/Instruments";
import Logo from "./components/logo/Logo";
import Done from "./assets/done.svg";
import Wrench from "./assets/wrench.svg";
import _ from "lodash";
import WindContainer from "./components/instruments/wind/WindContainer";

const getInitialSettings = () => ({
	animation: false,
	darkMode: false,
	serverAddress: "hello, world!",
	animationsAccordingToChargingStatus: true,
});

const removeInstrument = (instruments, id) => {
	const indices = id
		.split(".")
		.slice(1)
		.map(a => parseInt(a));

	const clonedInstruments = _.cloneDeep(instruments);

	let nodeToRemove = clonedInstruments;
	for (let i = 0; i < indices.length; i++) {
		const childIndex = indices[i];
		console.log(childIndex);
		if (nodeToRemove.type === "branch") {
			if (i === indices.length - 1) {
				nodeToRemove.children = nodeToRemove.children.slice(0, childIndex).concat(nodeToRemove.children.slice(childIndex + 1));
			} else {
				nodeToRemove = nodeToRemove.children[childIndex];
			}
		}
	}

	return clonedInstruments;
};

const Main = ({ parentStyle, colors, instruments, signalkState, connectionStatus, updateInstruments }) => {
	const [layoutEditingEnabled, setLayoutEditingEnabled] = useState(false);
	const [settingsPaneOpen, setSettingsPaneOpen] = useState(false);
	const [settings, setSettings] = useState(getInitialSettings());

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (instruments.length === 0) setLayoutEditingEnabled(true);
		}, 1000);

		return () => clearTimeout(timeout);
	}, [instruments]);

	const onInstrumentAdded = (id, node) => {
		// const cloned =
		const indices = id
			.split(".")
			.slice(1)
			.map(a => parseInt(a));

		// let clonedInstruments = _.map(instruments, _.clone);
		const clonedInstruments = _.cloneDeep(instruments);
		let nodeToAdd = clonedInstruments;
		for (const childIndex of indices) {
			console.log(nodeToAdd);
			if (nodeToAdd.type === "branch") {
				nodeToAdd = nodeToAdd.children[childIndex];
			} else {
				throw Error(`Something happened, got indices ${indices}, but encountered leaf node before the end of them.`);
			}
		}

		nodeToAdd.children.push(node);
		updateInstruments(clonedInstruments);
		// updateInstruments({
		// 	type: "branch",
		// 	children: instruments.children.concat(instrument),
		// });
	};

	const onInstrumentRemoved = id => {
		updateInstruments(removeInstrument(instruments, id));
	};

	return (
		// <div>main</div>
		<div className="instruments" style={parentStyle}>
			<SettingsDialog
				isModalOpen={settingsPaneOpen}
				requestClosing={() => setSettingsPaneOpen(false)}
				initialValues={settings}
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
				settings={settings}
				colors={colors}
				instruments={instruments}
				onInstrumentAdded={onInstrumentAdded}
				onInstrumentRemoved={onInstrumentRemoved}
				onInstrumentChanged={console.log}
				layoutEditingEnabled={layoutEditingEnabled}
				signalkState={signalkState}
			/>
			<div className="open-menu with-shadow">
				<button className="open-menu-wrapper" onClick={() => setSettingsPaneOpen(true)}>
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
