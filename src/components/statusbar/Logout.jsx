import React from "react";

import logout from "../../assets/logout.svg";

const Logout = ({ onLogout }) => {
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
			<img style={{ position: "relative", width: "1em", height: "1em" }} src={logout} alt={"log out"} />
		</div>
	);
};

export default Logout;
