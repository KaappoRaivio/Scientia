import React, { useEffect, useState } from "react";

const Clock = (props) => {
	const currentDate = new Date(Date.now());
	const [hours, setHours] = useState(currentDate.getHours() + "");
	const [minutes, setMinutes] = useState(currentDate.getMinutes() + "");
	const [seconds, setSeconds] = useState(currentDate.getSeconds() + "");

	useEffect(() => {
		setInterval(() => {
			const now = new Date(Date.now());
			setHours(now.getHours() + "");
			setMinutes(now.getMinutes() + "");
			setSeconds(now.getSeconds() + "");
		}, 1000);

		// return () => clearInterval(interval);
	});

	return <ClockComponent hours={hours} minutes={minutes} seconds={seconds} />;
};

const ClockComponent = ({ hours, minutes, seconds }) => (
	<div
		style={{
			display: "inline",
			fontSize: "1.5em",
			fontVariantNumeric: "tabular-nums",
		}}
	>
		{hours}.{minutes.padStart(2, "0")}:{seconds.padStart(2, "0")}
	</div>
);

export default Clock;
