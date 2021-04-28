import React from "react";

import styles from "./Quadrants.module.css";

const Quadrants = ({ children, removeInstrument }) => {
	// useEffect(() => {
	// 	console.log(children);
	// }, [children]);
	return (
		<div className={styles.parent}>
			{removeInstrument}
			{children.map((child, index) => (
				// <div className={styles.child}>{index}</div>
				<div className={styles.child}>{child}</div>
			))}
		</div>
	);
};

Quadrants.propTypes = {};

export default Quadrants;
