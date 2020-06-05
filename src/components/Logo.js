import React from "react";

import LogoAsset from "../assets/favicon.svg";

import "./Logo.css"

const Logo = (props) => {
    return <div className="logo-parent">
        <a className="logo-link" href={"https://github.com/KaappoRaivio/Scientia"} target="_blank" rel="noopener noreferrer"/>
        <div className="logo">
            <img src={LogoAsset} width="200px" alt="Logo"/>
        </div>
        <b className="name" >Scientia</b> <br/>
        <span  className="author">
            Kaappo Raivio
        </span>

    </div>
}

export default Logo;