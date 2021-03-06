import React from "react";
import Wind from "./Wind";

import { getByStringPath } from "delta-processor";

class WindContainer extends React.Component {
	constructor(props) {
		super(props);
		this.data = {};

		this.state = {
			closeHaulAngle: 41,
		};

		this.divisions = [
			{
				numberOfLines: 12,
				lineLength: 0.075,
				renderText: true,
				fontSize: 8,
				textProvider: i => Math.abs(180 - (((((2 * Math.PI) / 12) * i) / Math.PI) * 180).toFixed(0)),
				angleProvider: i => ((2 * Math.PI) / 12) * i,
			},
			{
				numberOfLines: 36,
				lineLength: 0.05,
				renderText: false,
				textProvider: i => "",
				angleProvider: i => ((2 * Math.PI) / 36) * i,
			},
			{
				numberOfLines: 144,
				lineLength: 0.025,
				renderText: false,
				textProvider: i => "",
				angleProvider: i => ((2 * Math.PI) / 144) * i,
			},
		];
	}

	render() {
		const wind = getByStringPath("environment.wind", this.props.data.vessels.self, true);

		let speed, speedQuality;
		if (wind.speedTrue !== null) {
			speed = wind.speedTrue;
			speedQuality = "T";
		} else if (wind.speedOverGorund !== null) {
			speed = wind.speedOverGorund;
			speedQuality = "T";
		} else {
			speed = wind.speedApparent;
			speedQuality = "A";
		}

		return (
			<Wind
				width={this.props.width}
				height={this.props.height}
				angleApparent={wind.angleApparent || {}}
				angleTrue={wind.angleTrueWater || wind.angleTrueGround || {}}
				speed={speed || {}}
				speedQuality={speedQuality}
				closeHaulAngle={this.state.closeHaulAngle}
				colors={this.props.colors}
				darkMode={this.props.darkMode}
				divisions={this.divisions}
				animation={this.props.animation}
				displayScale={wind?.speedTrue?.meta?.displayScale}
			/>
		);
	}
}

export default WindContainer;
