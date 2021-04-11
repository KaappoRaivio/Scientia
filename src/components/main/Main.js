import React, { useEffect } from "react";
import SettingsDialog from "../skeletons/SettingsDialog";
import StatusBar from "../statusbar/StatusBar";
import Instruments from "../instruments/Instruments";
import Logo from "../logo/Logo";
import Done from "../../assets/done.svg";
import Wrench from "../../assets/wrench.svg";
import { useDispatch, useSelector } from "react-redux";
import { setLayoutEditingEnabled, settingsPaneOpen } from "../../redux/actions/actions";
import AddInstrumentDialog from "../addinstrument/AddInstrumentDialog";
import Footer from "../footer/Footer";

const Main = ({ parentStyle, instruments }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (instruments.length === 0) dispatch(setLayoutEditingEnabled(true));
		}, 1000);

		return () => clearTimeout(timeout);
	}, [dispatch, instruments]);

	return (
		<div className="instruments" style={parentStyle}>
			<AddInstrumentDialog />
			<SettingsDialog />
			<StatusBar />
			<Instruments />
			<Footer />
			<Logo />
		</div>
	);
};

Main.propTypes = {};

export default Main;
