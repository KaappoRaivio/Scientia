import React from "react";
import PropTypes from "prop-types";
import { setLayoutEditingEnabled, settingsPaneOpen } from "../../redux/actions/actions";

import styles from "./Footer.module.css";
import Done from "../../assets/done.svg";
import Wrench from "../../assets/wrench.svg";
import { useDispatch, useSelector } from "react-redux";

const Footer = props => {
	const dispatch = useDispatch();
	const layoutEditingEnabled = useSelector(state => state.appState.layoutEditingEnabled);

	return (
		<div className={`${styles["open-menu"]} with-shadow`}>
			<button className={styles["open-menu-wrapper"]} onClick={() => dispatch(settingsPaneOpen(true))}>
				configure
			</button>
			<ToggleLayoutEditing editingEnabled={layoutEditingEnabled} onChange={newValue => dispatch(setLayoutEditingEnabled(newValue))} />
		</div>
	);
};

Footer.propTypes = {};

const ToggleLayoutEditing = ({ editingEnabled, onChange }) => {
	return (
		<div onClick={() => onChange(!editingEnabled)} className="configure-layout-wrapper">
			<img className="configure-layout" src={editingEnabled ? Done : Wrench} alt="toggle layout editing" width="auto" />
		</div>
	);
};

export default Footer;
