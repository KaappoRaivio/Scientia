import React from 'react';
import Clock from "./Clock";

import "./StatusBar.css"
import Weather from "./Weather";

import "../../assets/weather-icons-master/css/weather-icons.min.css"

const StatusBar = ({ colors, darkMode, signalkState }) => (
    <div className="statusbar-parent with-shadow">
        <div className="statusbar-left">
            <Clock/>
        </div>
        <div className="statusbar-right">
            <Weather signalkState={signalkState}/>
        </div>
    </div>
);

export default StatusBar;