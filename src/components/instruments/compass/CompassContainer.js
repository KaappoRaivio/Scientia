import React from "react";

import Compass from "./Compass";
import { mod } from "mathjs";

class CompassContainer extends React.Component {
	constructor(props) {
		super(props);

		this.divisions = [
			{
				numberOfLines: 12,
				lineLength: 0.15,
				renderText: true,
				textProvider: i => mod(180 - (360 / 12) * i, 360),
				angleProvider: i => ((2 * Math.PI) / 12) * i,
				fontSize: "80%",
			},
			{
				numberOfLines: 36,
				lineLength: 0.1,
				textProvider: i => "",
				angleProvider: i => ((2 * Math.PI) / 36) * i,
			},
			{
				numberOfLines: 144,
				lineLength: 0.05,
				textProvider: i => "",
				angleProvider: i => ((2 * Math.PI) / 144) * i,
			},
		];
	}

	render() {
		const heading = this.props?.data?.vessels?.self?.navigation?.courseOverGroundTrue;

		return (
			<Compass
				width={this.props.width}
				height={this.props.height}
				heading={heading}
				animate={this.props.animate}
				colors={this.props.colors}
				divisions={this.divisions}
			/>
		);
	}
}

export default CompassContainer;
