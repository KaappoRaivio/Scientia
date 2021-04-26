import React from "react";

import styles from "./Stacked.module.css";

const Stacked = ({ children }) => {
	return (
		<div className={styles.parent}>
			{children.map(child => (
				<div className={styles.child}>{child}</div>
			))}
		</div>
	);
};

Stacked.propTypes = {};

export default Stacked;
