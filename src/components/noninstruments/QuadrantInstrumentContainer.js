import React from 'react';
import * as PropTypes from "prop-types";

import "./quadrandinstrumentcontainer.css"

class QuadrantInstrumentContainer extends React.Component {
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
            let context = this, args = arguments;
            let later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            let callNow = immediate && !timeout;
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
                console.log("succ")
            } catch (err) {}
        }, this.props.resizeDebounce));

    }

    render() {
        const props = {
            width: this.state.width / 2 - 10,
            height: this.state.height / 2 - 5,
            subscribe: this.props.callback,
            ref: this.child,
            animate: this.props.animate,
            darkMode: this.props.darkMode,
            colors: this.props.colors,
            key: this.props.children.id,
        };

        const parentStyle = {
            height: this.state.height,
            fontSize: this.state.width / 20,
            color: this.props.colors.primary,
            // backgroundColor: this.props.colors.background,
            margin: 0
        };

        return (
            <div className="single-flexbox-item" style={parentStyle}>
                <div className="quadrant-flexbox-wrapper">
                    {/*<div className="quadrant-place-1 with-shadow">*/}
                    {/*    {*/}
                    {/*        React.createElement(this.props.children,*/}
                    {/*            props,*/}
                    {/*            [])*/}
                    {/*    }*/}
                    {/*</div>*/}
                    {/*<div className="quadrant-place-2 with-shadow">*/}
                    {/*    {*/}
                    {/*        React.createElement(this.props.children,*/}
                    {/*            props,*/}
                    {/*            [])*/}
                    {/*    }*/}
                    {/*</div>*/}
                    {/*<div className="quadrant-place-3 with-shadow">*/}
                    {/*    {*/}
                    {/*        React.createElement(this.props.children,*/}
                    {/*            props,*/}
                    {/*            [])*/}
                    {/*    }*/}
                    {/*</div>*/}
                    {/*<div className="quadrant-place-4 with-shadow">*/}
                    {/*    {*/}
                    {/*        React.createElement(this.props.children,*/}
                    {/*            props,*/}
                    {/*            [])*/}
                    {/*    }*/}
                    {/*</div>*/}
                    {
                        this.props.children.map((instrument, index) => {

                            return <div className={`quadrant-place-${index + 1} with-shadow`}>
                                {React.createElement(instrument.component, {...props, ...instrument.additionalProps}, [])}
                            </div>
                        })
                    }
                    <canvas className="probe" ref={this.probeCanvas} width={this.state.width} height={this.state.height}/>
                </div>
            </div>
        )
    }
}

QuadrantInstrumentContainer.propTypes = {
    width: PropTypes.any,
    height: PropTypes.any,
    children: PropTypes.any
}

export default QuadrantInstrumentContainer;