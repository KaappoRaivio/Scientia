import React from "react";

import "./instruments.css"

class InstrumentContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            number: 0,
            width: 0,
            height: 0
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
    fitToContainer (canvas, measuredCanvas) {
        canvas.style.width = "100%";
        canvas.style.height ="100%";

        // console.log("setting state!")
        this.setState({
            width: Math.round(measuredCanvas.offsetWidth),
            height: Math.round(measuredCanvas.offsetWidth)
        });
    }

    componentDidMount() {
        this.test = this.refs.test;
        this.fitToContainer(this.test, this.test);


        this.componentDidUpdate();
        window.addEventListener("resize", this.debounce(() => {
            this.fitToContainer(this.test, this.test);
            this.componentDidUpdate();
        }, 10));

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log("moi");
        let canvas = this.test;
        // this.fitToContainer(canvas);
        let ctx = canvas.getContext("2d");
        ctx.font = "20px Courier";

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.rect(0, 0, canvas.width, canvas.height);
        // ctx.fillText(this.state.number + "asd", 0, canvas.height / 2);
        ctx.stroke();


    }

    render() {
        // console.log(this.state.width, this.state.height);
        return (
            <div className="col-3 col-t-4 col-s-6" style={{height: this.state.height}}>
                {
                    React.createElement(this.props.children,
                        {width: this.state.width, height: this.state.height, subscribe: this.props.callback},
                        [])
                }

                <canvas className="canvas_update" ref="test" width={this.state.width} height={this.state.height}/>
                {/*<canvas className="canvas_background" ref="canvas_background" width={this.state.width} height={this.state.height}/>*/}
            </div>
        )
    }
}

export default InstrumentContainer;