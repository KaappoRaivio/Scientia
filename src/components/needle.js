import * as React from "react";

import "./needle.css"

class Needle extends React.Component {
    render() {
        if (this.props.angle === null) {
            return <div></div>;
        }

        return (
            <div className="wrapper" style={{height: `${this.props.radius}%`}}>
                <div className="needleTest" style={{transform: `rotate(${this.props.angle / Math.PI * 180 - 180}deg)`}}>
                    <div className="needle" style={{backgroundColor: this.props.color}}/>
                </div>
            </div>
        )
    }
}

export default Needle