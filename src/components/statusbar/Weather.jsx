import React from "react";
import WeatherIcons from "react-weathericons";

import "./Weather.css";

import iconMap from "../../assets/icons.json";
import _ from "underscore";
import NoData from "../instruments/helpers/NoData";

class Weather extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			icon: null,
			temperature: null,
			windDirection: null,
			windSpeed: null,
		};
	}

	componentDidMount() {
		const updateWeather = (position, apiKey) => {
			getWeather(position, apiKey).then(json => {
				this.setState({
					icon: iconMap[json?.weather?.[0]?.id]?.icon,
					temperature: Math.round(json?.main?.temp - 273.15),
					windDirection: json?.wind?.deg,
					windSpeed: json?.wind?.speed,
				});
			});
		};
		setTimeout(() => {
			const position = this.props.signalkState?.vessels?.self?.navigation?.position?.value;
			console.log(position);
			updateWeather(position || { latitude: null, longitude: null }, this.props.apiKey);
			setInterval(() => updateWeather(position || { latitude: null, longitude: null }, this.props.apiKey), 120000);
		}, 5000);
	}

	render() {
		return (
			<div style={{ fontSize: "125%", display: "inline" }}>
				<WeatherComponent
					colors={this.props.colors}
					darkMode={this.props.darkMode}
					icon={this.state.icon}
					temperature={this.state.temperature}
					windDirection={this.state.windDirection}
					windSpeed={this.state.windSpeed}
				/>
			</div>
		);
	}
}

const WeatherComponent = ({ icon, temperature, windDirection, windSpeed, colors, darkMode }) => {
	if (_.any([icon, temperature, windDirection, windSpeed].map(x => x == null))) {
		return (
			<div
				style={{
					position: "absolute",
					right: 0,
					top: 0,
					display: "inline",
				}}>
				<NoData width={"1em"} height={"1em"} colors={colors} />
			</div>
		);
	}

	return (
		<div style={{ display: "inline" }}>
			{temperature} °C 
			<span style={{ fontSize: "150%" }}>
				<WeatherIcons name={`day-${icon}`} />
			</span>
			<span>
				<WindIcon direction={windDirection} />
				{windSpeed} m/s
			</span>
		</div>
	);
};

const WindIcon = ({ direction }) => (
	<svg className="windicon-parent" style={{ transform: `rotate(${direction + 180}deg)` }} stroke={"black"} strokeWidth={1}>
		{/*<circle cx="50%" cy="50%" r="50%" fill="orange" />*/}
		<line x1={"50%"} x2={"50%"} y1={"0%"} y2={"100%"} />
		<line x1={"25%"} x2={"50%"} y1={"60%"} y2={"100%"} />
		<line x1={"50%"} x2={"75%"} y1={"100%"} y2={"60%"} strokeWidth={1.4} />
	</svg>
);

// const apiKey = "";

const getWeather = ({ latitude, longitude }, apiKey) =>
	fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
		.then(res => res.json())
		.then(json => {
			return json;
		});

export default Weather;
