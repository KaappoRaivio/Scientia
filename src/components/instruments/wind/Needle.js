import * as React from "react";

import "./needle.css"

const Needle = (props) => {
    if (props.angle === null) {
        return <div/>;
    }
    let style;
    if (props.animate) {
        style = {
            transform: `rotate(${props.angle / Math.PI * 180 - 180}deg)`,
        };
    } else {
        style = {
            transform: `rotate(${props.angle / Math.PI * 180 - 180}deg)`, transition: "none"
        };
    }

    if (props.demo) {
        style = {...style, animation: "needle 6s ease-in-out infinite"};
    }

    return (
        <div className="wrapper" style={{height: `${props.radius}%`}} >
            <div className="needleTest" style={style}>
                <div className="needle" style={{backgroundColor: props.color}}/>
            </div>
        </div>
    )
}

export default Needle;