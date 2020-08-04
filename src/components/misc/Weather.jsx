import React from 'react';

class Weather extends React.Component {
    componentDidMount() {
        getPosition()
            .then(position => {
                getWeather(position.value);
            })
    }

    render() {
        return (
            <WeatherComponent/>
        );
    }
}

const WeatherComponent = props => {
    return <i style={{transform: "scale(1.3)"}} className="wi wi-day-sunny"/>
}

const apiKey = "743fcf245791b649c2cef6919c661f27";

const getPosition = () => (
    fetch("/signalk/v1/api/vessels/self/navigation/position")
        .then(response => response.json())
        .then(json => {
            console.log("Position", json)
            return json;
        })
)

const getWeather = ({latitude, longitude}) =>
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=fi`)
        .then(res => res.json())
        .then(json => {
            console.log("weather", json);
            return json;
        })

export default Weather;