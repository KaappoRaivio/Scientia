import React from "react";

import LogoAsset from "../assets/favicon.svg";

import "./Logo.css"

const Logo = (props) => {
    console.log(window.innerWidth)
    return <div className="logo-wrapper">
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