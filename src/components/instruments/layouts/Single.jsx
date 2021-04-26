import React from "react";
import PropTypes from "prop-types";

import styles from "./Single.module.css";

const Single = ({ children }) => {
	return (
		<div className={styles.parent}>
			<div className={styles.wrapper}>{children}</div>
		</div>
	);
};

Single.propTypes = {};

export default Single;
