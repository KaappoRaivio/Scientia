import React from "react";

class AutoFitTextBox extends React.Component {
	constructor(props) {
		super(props);
		this.svgTextNode = React.createRef();
		this.state = { scale: 1 };
	}

	getTextBBox() {
		return this.svgTextNode.current.getBBox();
	}

	getTextScale(textNode) {
		if (textNode === null) return this.props.initialFontSize;

		const { width, height } = this.props;
		if (!this.bbox) {
			this.bbox = this.getTextBBox();
		}
		const textBBox = this.bbox;

		const widthScale =
			(width / textBBox.width) * this.props.initialFontSize;
		return Math.min(widthScale, height);
	}

	render() {
		// const { scale } = this.state;
		// // console.log(scale)
		// const fontSize = window.getComputedStyle(this.svgTextNode.current).getPropertyValue("font-size");
		// // console.log(fontSize);

		// this.setState({ scale: scale});
		const scale = this.getTextScale(this.svgTextNode.current);
		// // console.log(scale, this.props.value.length)
		const {
			value,
			maxNumberOfDigits,
			initialFontSize,
			...restOfTheProps
		} = this.props;

		return (
			<text
				ref={this.svgTextNode}
				// fontSize={scale}
				// fontSize={"1em"}
				// scale={scale}
				fontSize={scale}
				{...restOfTheProps}
				// y={this.props.height}
				// y={"50%"}
				// width={"100%"}
				// alignmentBaseline="hanging">
			>
				{value.padStart(maxNumberOfDigits, " ")}
			</text>
		);
	}
}

export default AutoFitTextBox;
