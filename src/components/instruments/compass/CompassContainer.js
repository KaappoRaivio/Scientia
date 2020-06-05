import React from 'react';

import Compass from "./Compass";
import {mod} from "mathjs";

class CompassContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            heading: 0,
        };

        this.divisions = [
            {
                numberOfLines: 12,
                lineLength: 0.15,
                textProvider: i => mod(180 - 360 / 12 * i, 360),
                angleProvider: i => 2 * Math.PI / 12 * i,
                fontSize: "80%"
            },
            {numberOfLines: 36, lineLength: 0.1, textProvider: i => "", angleProvider: i => 2 * Math.PI / 36 * i},
            {numberOfLines: 144, lineLength: 0.05, textProvider: i => "", angleProvider: i => 2 * Math.PI / 144 * i},
        ]
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
            divisions={this.divisions}
        />
    }


}

export default CompassContainer