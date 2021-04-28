import React from "react";

import styles from "./Stacked.module.css";

const Stacked = ({ children, removeInstrument }) => {
	return (
		<div className={styles.parent}>
			{removeInstrument}
			{children.map(child => (
				<div className={styles.child}>{child}</div>
			))}
		</div>
	);
};

Stacked.propTypes = {};

export default Stacked;
