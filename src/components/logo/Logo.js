import React from "react";

import LogoAsset from "../../assets/favicon.svg";

import "./Logo.css";

class Logo extends React.Component {
	constructor(props) {
		super(props);

		this.handleButtonPress = this.handleButtonPress.bind(this);
		this.handleButtonRelease = this.handleButtonRelease.bind(this);
	}

	handleButtonPress() {
		this.buttonPressTimer = setTimeout(() => {
			let win = window.open("https://github.com/KaappoRaivio/Scientia", "_blank");
			win.focus();
		}, 7000);
	}

	handleButtonRelease() {
		clearTimeout(this.buttonPressTimer);
	}

	render() {
		return (
			<div
				className="logo-parent"
				onTouchStart={this.handleButtonPress}
				onTouchEnd={this.handleButtonRelease}
				onMouseDown={this.handleButtonPress}
				onMouseUp={this.handleButtonRelease}
				onMouseLeave={this.handleButtonRelease}>
				{/*<a className="logo-link" href={"https://github.com/KaappoRaivio/Scientia"} target="_blank"*/}
				{/*   rel="noopener noreferrer">*/}
				{/*</a>*/}
				<div className="logo">
					<img src={LogoAsset} width="200px" alt="Logo" onDragStart={e => e.preventDefault()} />
				</div>
				<b className="name">Scientia</b> <br />
				<span className="author">Kaappo Raivio</span>
			</div>
		);
	}
}

export default Logo;
