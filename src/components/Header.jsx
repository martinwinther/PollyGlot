import parrot from "../assets/parrot.png";
import "./Header.css";

function Header() {
	return (
		<header className="header">
			<img src={parrot} alt="" className="header-logo" />
			<div className="header-text">
				<h1 className="header-title">PollyGlot</h1>
				<p className="header-tagline">Perfect Translation Every Time</p>
			</div>
		</header>
	);
}

export default Header;
