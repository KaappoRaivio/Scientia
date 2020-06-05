import React from 'react';

// import TextBox from './TextBox';

class AutoFitTextBox extends React.Component {
    constructor(props) {
        super(props);
        this.svgTextNode = React.createRef();
        this.state = { scale: 1 };
    }

    componentDidMount() {
        // setTimeout(() => {
        //
        // }, 1000)
        // setTimeout(this.componentDidMount.bind(this), 1000);
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        // const textBBox = this.getTextBBox();
        // console.log(this.props.height, textBBox.height, this.props.height / textBBox.height)
        // console.log(this.props.width, textBBox.width, this.props.width / textBBox.width)
    }

    getTextBBox() {
        // console.log(this.svgTextNode.current)
        return this.svgTextNode.current.getBBox();
    }

    getTextScale (textNode) {
        if (textNode === null) return this.props.initialFontSize;
        // console.log(textNode)

        const { width, height } = this.props;
        if (!this.bbox) {
            console.log("not good")
            this.bbox = this.getTextBBox();
        }
        const textBBox = this.bbox;

        // console.log(textBBox)

        const widthScale = width / textBBox.width * this.props.initialFontSize;
        const heightScale = this.props.height;
        // const heightScale = height / (textBBox.height);
        // console.log(textBBox.width, textBBox.height, width, height)

        const scale = Math.min(widthScale, heightScale);
        return scale;

    }

    render() {
        // const { scale } = this.state;
        // console.log(scale)
        // const fontSize = window.getComputedStyle(this.svgTextNode.current).getPropertyValue("font-size");
        // console.log(fontSize);

        // this.setState({ scale: scale});
        const scale = this.getTextScale(this.svgTextNode.current);
        // console.log(scale, this.props.value.length)
        return (

            <text
                ref={this.svgTextNode}
                // fontSize={scale}
                // fontSize={"1em"}
                // scale={scale}
                fontSize={scale}
                {...this.props}
                // y={this.props.height}
                // y={"50%"}
                // width={"100%"}
                // alignmentBaseline="hanging">
                >
                {this.props.value.padStart(this.props.maxNumberOfDigits, " ")}
            </text>
        );
    }
};

export default AutoFitTextBox;