import React, { useEffect, useRef, useState } from "react";

import "../Instruments.css";
import "./SingleInstrumentContainer.css";
import RemoveInstrument from "./RemoveInstrument";
import { useErrorBoundary } from "use-error-boundary";
import ErrorBoundary from "../../error/InstrumentErrorBoundary";

const SingleInstrumentContainer = ({ additionalProps, id, element, colors, index, layoutEditingEnabled, onRemoveClick }) => {
	const probe = useRef(React.createRef());
	const [sideLength, setSideLength] = useState({ width: null, height: null });
	const width = probe.current?.offsetWidth;

	useEffect(() => {
		const handler = () => {
			setSideLength({ width: probe.current?.offsetWidth, height: probe.current?.offsetHeight });
			console.log({ width: probe.current?.offsetWidth, height: probe.current?.offsetHeight });
		};

		let timeoutID = null;
		const resizeListener = () => {
			clearTimeout(timeoutID);
			timeoutID = setTimeout(handler, 100);
		};

		setTimeout(handler, 100);

		window.addEventListener("resize", resizeListener);
		return () => window.removeEventListener("resize", resizeListener);
	}, []);

	if (element == null) {
		return <div>No element</div>;
	}

	const childProps = {
		width: sideLength.width,
		height: sideLength.height,
		colors,
		...additionalProps,
	};

	const parentStyle = {
		height: sideLength.width,
		fontSize: Math.min(sideLength.width / 10, (sideLength.height / 10) * 0.58),
		color: colors.primary,
		backgroundColor: colors.background,
	};

	// return didCatch ? (
	// 	<p>Error occured: {error}</p>
	// ) : (
	// 	<ErrorBoundary>
	return (
		<div className="single-grid-item with-shadow" style={parentStyle}>
			<RemoveInstrument onClick={() => onRemoveClick(id)} enabled={layoutEditingEnabled} />
			<div className="single-flexbox-wrapper">
				<ErrorBoundary>{React.createElement(element, childProps, [])}</ErrorBoundary>
			</div>
			<div className="probe" ref={probe} />
		</div>
	);
	// </ErrorBoundary>
	// );
};

export default SingleInstrumentContainer;
