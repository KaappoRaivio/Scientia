import React from "react";

import "../instruments.css"
import "./singleinstrumentcontainer.css"

class SingleInstrumentContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            width: 100,
            height: 100
        };

        this.probeCanvas = React.createRef();
        this.child = React.createRef();

        this.resizer = this.debounce(() => {
            this.fitToContainer(this.probeCanvas.current);
            try {
                this.child.current.onResize();
            } catch (err) {}
        }, this.props.resizeDebounce);
    }

    debounce (func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    fitToContainer (canvas, ) {
        try {
            canvas.style.width = "100%";
            canvas.style.height ="100%";
    
            this.setState({
                width: Math.round(canvas.offsetWidth),
                height: Math.round(canvas.offsetWidth)
            });
        } catch (e) {

        }
    }

    componentDidMount() {
        this.fitToContainer(this.probeCanvas.current);
        window.addEventListener("resize", this.resizer);

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.forceResize) {
            this.resizer()
        }
    }

    render() {
        const props = {
            width: this.state.width,
            height: this.state.height,
            ref: this.child,
            animate: this.props.animate,
            darkMode: this.props.darkMode,
            colors: this.props.colors,
            data: this.props.data,
            ...this.props.additionalProps,
        };

        const parentStyle = {
            height: this.state.height,
            fontSize: this.state.width / 10,
            color: this.props.colors.primary,
            // backgroundColor: this.props.colors.background,
        };

        return (
            <div className="single-flexbox-item with-shadow" style={parentStyle}>
                <RemoveInstrument width={this.state.width} height={this.state.height} onRemoveClick={() => this.props.onRemoveClick(this.props.index)} />
                <div className="single-flexbox-wrapper">
                    {
                        React.createElement(this.props.children,
                            props,
                            [])
                    }
                    <canvas className="probe" ref={this.probeCanvas} width={this.state.width} height={this.state.height}/>
                </div>
            </div>
        )
    }
}

const RemoveInstrument = ({height, width, onRemoveClick}) => {
    const svgSize = {width: width / 10, height: height / 10};

    const lineLength = 0.75;

    return <svg style={{right: 10, top: 10, position: "absolute", zIndex: 10}} width={svgSize.width} height={svgSize.height} onClick={onRemoveClick}>
            <circle cx={svgSize.width / 2} cy={svgSize.height / 2} r={svgSize.width / 2} fill={"gray"} strokeWidth={0}/>
            <g strokeWidth={svgSize.width * 0.1} stroke={"white"} strokeLinecap="round">
                <line x1={svgSize.width * (1 - lineLength)} x2={svgSize.width * lineLength} y1={svgSize.height * (1 - lineLength)} y2={svgSize.height * lineLength} />
                <line x2={svgSize.width * (1 - lineLength)} x1={svgSize.width * lineLength} y1={svgSize.height * (1 - lineLength)} y2={svgSize.height * lineLength} />
            </g>
        </svg>
}

export default SingleInstrumentContainer;