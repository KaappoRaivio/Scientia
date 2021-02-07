import React, { useEffect, useRef, useState } from "react";

// constructor(props) {
// 	super(props);
// 	this.svgTextNode = React.createRef();
// }
//

const AutoFitTextBox = props => {
	// const scale = this.getTextScale(this.svgTextNode.current);
	const { value, maxNumberOfDigits, width, height, initialFontSize, ...restOfTheProps } = props;

	const svgTextNode = useRef(React.createRef());
	const [bbox, setBBox] = useState(null);
	const [scale, setScale] = useState(initialFontSize);
	useEffect(() => {
		setBBox(svgTextNode.current.getBBox());
	}, [svgTextNode]);

	useEffect(() => {
		if (svgTextNode.current !== null && bbox) {
			const widthScale = (width / bbox.width) * initialFontSize;
			setScale(Math.min(widthScale, height));
		}
	}, [bbox, height, initialFontSize, scale, width]);

	return (
		<text ref={svgTextNode} fontSize={scale} width={width} height={height} {...restOfTheProps}>
			{value.padStart(maxNumberOfDigits, " ")}
		</text>
	);
};

export default AutoFitTextBox;
