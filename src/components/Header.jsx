import React from "react";
import logo from "../assets/parrot.png";
import "./Header.css";
function Header() {
	return (
		<header className="header">
			<img src={logo} alt="PollyGlot Logo" className="header-logo" />
			<h1 className="header-title">PollyGlot</h1>
			<p className="header-tagline">Perfect Translation Every Time</p>
		</header>
	);
}

export default Header;
