import React from "react";

import "../instruments.css"
import "./singleinstrumentcontainer.css"
import RemoveInstrument from "./RemoveInstrument";

class SingleInstrumentContainer extends React.Component {
    constructor(props) {
        super(props);

        this.probe = React.createRef();
        this.child = React.createRef();
    }

    render() {
        const sideLength = (this.probe.current || {}).offsetWidth || 0;

        const props = {
            width: sideLength,
            height: sideLength,
            ref: this.child,
            animate: this.props.animate,
            darkMode: this.props.darkMode,
            colors: this.props.colors,
            data: this.props.data,
            ...this.props.additionalProps,
        };

        const parentStyle = {
            height: sideLength,
            fontSize: sideLength / 10,
            color: this.props.colors.primary,
            backgroundColor: this.props.colors.background,
        };

        if (this.props.children == null) {
            return <div>No children</div>
        }

        return (
            <div className="single-flexbox-item with-shadow" style={parentStyle}>
                <RemoveInstrument width={sideLength} height={sideLength} onRemoveClick={() => this.props.onRemoveClick(this.props.index)} enabled={this.props.layoutEditingEnabled}/>
                <div className="single-flexbox-wrapper">
                    {
                        React.createElement(this.props.children,
                            props,
                            [])
                    }
                    <div style={{position: "absolute", width: "100%", height: "100%", zIndex: -1000}} ref={this.probe}/>
                </div>
            </div>
        )
    }
}

export default SingleInstrumentContainer;