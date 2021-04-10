import React from "react";

import logoutSVG from "../../assets/logout.svg";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/actions/actions";

const Logout = ({}) => {
	const dispatch = useDispatch();
	const onLogout = () => {
		console.log("Loggoing out");
		dispatch(logout());
	};
	return (
		<div
			style={{
				position: "relative",
				display: "inline",
				marginLeft: "10px",
				width: "1em",
				height: "1em",
			}}
			onClick={onLogout}>
			<img style={{ position: "relative", width: "1em", height: "1em" }} src={logoutSVG} alt={"log out"} />
		</div>
	);
};

export default Logout;
