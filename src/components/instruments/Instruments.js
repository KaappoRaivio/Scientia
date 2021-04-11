import React from "react";

import "./Instruments.css";
import InstrumentTreeNode from "../InstrumentTreeNode";
import { useSelector } from "react-redux";

const Instruments = ({}) => {
	const animation = useSelector(state => state.settings.performance.animation);
	const darkMode = useSelector(state => state.settings.appearance.darkMode);
	const signalkState = useSelector(state => state.signalkState);
	const colors = useSelector(state => state.settings.appearance.colors);

	const additionalProps = { animation, darkMode, data: signalkState };
	const instruments = useSelector(state => state.instrumentLayout);
	const layoutEditingEnabled = useSelector(state => state.appState.layoutEditingEnabled);

	return (
		<div className="instrument-grid-container">
			<InstrumentTreeNode branch={instruments} additionalProps={additionalProps} colors={colors} layoutEditingEnabled={layoutEditingEnabled} />
		</div>
	);
};

export default Instruments;
