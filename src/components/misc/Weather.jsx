import React from 'react';
import WeatherIcons from "react-weathericons";

import "./Weather.css"

import iconMap from "../../assets/icons.json";
import Wind from "../instruments/wind/Wind";

class Weather extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            icon: "cloudy",
            temperature: "probably freezing",
            windDirection: 0,
            windSpeed: 0,
        };
    }

    componentDidMount() {
        const updateWeather = (position) => {
            getWeather(position)
                .then(json => {
                    this.setState({
                        icon: iconMap[json?.weather?.[0]?.id]?.icon,
                        temperature: Math.round(json?.main?.temp - 273.15),
                        windDirection: json?.wind?.deg,
                        windSpeed: json?.wind?.speed
                    });
                });
        }
        updateWeather(this.props.signalkState?.vessels?.self?.navigation?.position || {latitude: null, longitude: null});
        setInterval(() => updateWeather(this.props.signalkState?.vessels?.self?.navigation?.position || {latitude: null, longitude: null}), 120000)
    }

    render() {
        return (
            <div style={{fontSize: "125%"}}>
                <WeatherComponent icon={this.state.icon}
                                  temperature={this.state.temperature}
                                  windDirection={this.state.windDirection}
                                  windSpeed={this.state.windSpeed}/>
            </div>
        );
    }
}

const WeatherComponent = ({icon, temperature, windDirection, windSpeed}) => {
    return <div style={{display: "inline"}}>
        {temperature} °C 
        <span style={{fontSize: "150%"}}>
            <WeatherIcons name={`day-${icon}`} size={"1x"}/>
        </span>
        <span>
            <WindIcon direction={windDirection } />
            {windSpeed} m/s
        </span>
    </div>
}

const WindIcon = ({direction}) => (
    <svg className="windicon-parent" style={{transform: `rotate(${direction + 180}deg)`}} stroke={"black"} strokeWidth={1}>
        {/*<circle cx="50%" cy="50%" r="50%" fill="orange" />*/}
        <line x1={"50%"} x2={"50%"} y1={"0%"} y2={"100%"} />
        <line x1={"25%"} x2={"50%"} y1={"60%"} y2={"100%"} />
        <line x1={"50%"} x2={"75%"} y1={"100%"} y2={"60%"} strokeWidth={1.4} />
    </svg>
)

const apiKey = "743fcf245791b649c2cef6919c661f27";
//
// const getPosition = () => (
//     fetch("/signalk/v1/api/vessels/self/navigation/position")
//         .then(response => response.json())
//         .then(json => {
//             console.log("Position", json)
//             return json;
//         })
// )

const getWeather = ({latitude, longitude}) =>
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
        .then(res => res.json())
        .then(json => {
            console.log("weather", json);
            return json;
        })

export default Weather;