import React from 'react';

import "./quadrandinstrumentcontainer.css"

const QuadrantInstrumentContainer = props => <div className="single-flexbox-item">
    <div className="quadrant-flexbox">
        {props.children.map(child => <div className="quadrant-flexbox-item">
            {child}
        </div>)}
    </div>
</div>;

export default QuadrantInstrumentContainer;