import * as React from "react";

import "./needle.css"

class Needle extends React.Component {
    render() {
        return (
            <div className="wrapper" >
                <div className="needleTest" style={{transform: `rotate(${this.props.angle - 180}deg)`}}>
                    <div className="needle" style={{backgroundColor: this.props.color}}/>
                </div>
            </div>
        )
    }
}

export default Needle