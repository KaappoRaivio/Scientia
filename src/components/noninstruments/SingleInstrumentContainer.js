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
        canvas.style.width = "100%";
        canvas.style.height ="100%";

        this.setState({
            width: Math.round(canvas.offsetWidth),
            height: Math.round(canvas.offsetWidth)
        });
    }

    componentDidMount() {

        this.fitToContainer(this.probeCanvas.current);

        window.addEventListener("resize", this.debounce(() => {
            this.fitToContainer(this.probeCanvas.current);
            try {
                this.child.current.onResize();
                // console.log("succ")
            } catch (err) {}
        }, this.props.resizeDebounce));

    }

    render() {
        const props = {
            width: this.state.width,
            height: this.state.height,
            subscribe: this.props.callback,
            ref: this.child,
            animate: this.props.animate,
            darkMode: this.props.darkMode,
            colors: this.props.colors,
            key: this.props.children.id,
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