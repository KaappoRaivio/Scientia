import React from 'react';

import NumberDisplay from "../../numberdisplay.js"
import Svghelpers from "../../misc/svghelpers";

import {mod} from "mathjs";
import Compass from "./Compass";

class CompassContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            heading: 0,
        };
    }



    componentDidMount() {
        this.subscribe();
    }

    subscribe () {
        this.onMessage = (message) => {
            const extracted = message.values[0].value;
            this.setState({heading: extracted / Math.PI * 180});
        };
        this.props.subscribe([/navigation\.courseOverGroundTrue/], this.onMessage);
    }

    render () {
        return <Compass
            width={this.props.width}
            height={this.props.height}

            heading={this.state.heading}
            animate={this.props.animate}
            colors={this.props.colors}
        />
    }


}

export default CompassContainer