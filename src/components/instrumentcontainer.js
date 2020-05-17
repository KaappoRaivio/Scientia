import React from "react";

import "./instruments.css"

class InstrumentContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            width: 100,
            height: 100
        };
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

        this.test = this.refs.test;
        this.fitToContainer(this.test);

        window.addEventListener("resize", this.debounce(() => {
            this.fitToContainer(this.test);
            try {
                this.refs.child.onResize();
            } catch (err) {}
        }, this.props.resizeDebounce || 250));

    }

    componentDidUpdate() {
            try {
                // this.refs.child.onResize();
            } catch (err) {}
    }


    render() {
        // console.log(this.state.width, this.state.height);

        return (
            <div className="col-3 col-t-4 col-s-6 container" style={{height: this.state.height, fontSize: this.state.width / 10}}>
                {
                    React.createElement(this.props.children,
                        {width: this.state.width, height: this.state.height, subscribe: this.props.callback, ref: "child", ...this.props.additionalProps, animate: true},
                        [])
                }

                <canvas className="canvas_update" ref="test" width={this.state.width} height={this.state.height}/>
                {/*<canvas className="canvas_background" ref="canvas_background" width={this.state.width} height={this.state.height}/>*/}
            </div>
        )
    }
}

export default InstrumentContainer;