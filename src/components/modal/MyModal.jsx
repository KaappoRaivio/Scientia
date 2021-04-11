import React from "react";
import PropTypes from "prop-types";

import styles from "./MyModal.module.css";

import Modal from "react-modal";
import { useSelector } from "react-redux";

const MyModal = ({ children, isOpen, onRequestClose, style, ...rest }) => {
	const colors = useSelector(state => state.settings.appearance.colors);

	return (
		<Modal
			className={`${styles["modal-parent"]} with-shadow`}
			style={{
				overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
				content: {
					color: colors.primary,
					backgroundColor: colors.background,
					...style,
				},
			}}
			ariaHideApp={false}
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			{...rest}>
			{children}
		</Modal>
	);
};

MyModal.propTypes = {};

export default MyModal;
