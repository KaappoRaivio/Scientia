import React from "react";

import styles from "./Quadrants.module.css";

const Quadrants = ({ children }) => {
	return <div className={styles.parent}>{children}</div>;
};

Quadrants.propTypes = {};

export default Quadrants;
