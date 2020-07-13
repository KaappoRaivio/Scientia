import React from 'react';

import "./quadrandinstrumentcontainer.css"
import AddInstrument from "./AddInstrument";
import SingleInstrumentContainer from "./SingleInstrumentContainer";

const QuadrantInstrumentContainer = props => {
    return <div className="single-flexbox-item">
        <div className="quadrant-flexbox">
            {props.children.map(child => <div className="quadrant-flexbox-item">
                {child}
            </div>)}
        </div>
    </div>;
};

export default QuadrantInstrumentContainer;