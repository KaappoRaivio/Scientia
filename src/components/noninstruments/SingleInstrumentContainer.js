import React from "react";

import "../instruments.css"
import "./singleinstrumentcontainer.css"
import RemoveInstrument from "./RemoveInstrument";

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
            this.setDimensions(this.probeCanvas.current);
            try {
                this.child.current.onResize();
            } catch (err) {}
        }, this.props.resizeDebounce);
    }

    debounce (func, wait, immediate) {
        let timeout;
        return function () {
            const context = this;
            const args = arguments;
            const later = () => {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };

            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);

            if (callNow) {
                func.apply(context, args);
            }
        };
    };

    setDimensions (canvas) {
        try {
            canvas.style.width = "100%";
            canvas.style.height ="100%";
    
            this.setState({
                width: Math.round(canvas.offsetWidth),
                height: Math.round(canvas.offsetWidth)
            });
        } catch (e) {}
    }

    componentDidMount() {
        this.setDimensions(this.probeCanvas.current);
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
            backgroundColor: this.props.colors.background,
        };

        return (
            <div className="single-flexbox-item with-shadow" style={parentStyle}>
                <RemoveInstrument width={this.state.width} height={this.state.height} onRemoveClick={() => this.props.onRemoveClick(this.props.index)} enabled={this.props.layoutEditingEnabled}/>
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

export default SingleInstrumentContainer;