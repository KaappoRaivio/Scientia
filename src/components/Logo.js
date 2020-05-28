import React from "react";

import LogoAsset from "../assets/favicon.svg";

import "./Logo.css"

const Logo = (props) => {
    return <div className="logo-wrapper">
        <div className="logo">
            <img src={LogoAsset} width="12.5%" alt="Logo"/>
        </div>
        Author and developer: Kaappo Raivio
    </div>
}

export default Logo;