import "./Header.css";

function Header() {
	return (
		<header className="header">
			{/* The mark is the app in miniature: a lit screen with two lines
			    of subtitle sitting in the lower half of it */}
			<svg
				className="header-mark"
				viewBox="0 0 40 40"
				aria-hidden="true"
				focusable="false"
			>
				<rect
					className="header-mark-screen"
					x="2.75"
					y="7.75"
					width="34.5"
					height="24.5"
					rx="6"
				/>
				<rect
					className="header-mark-line"
					x="9"
					y="19"
					width="22"
					height="3"
					rx="1.5"
				/>
				<rect
					className="header-mark-line header-mark-line--short"
					x="14"
					y="25"
					width="12"
					height="3"
					rx="1.5"
				/>
			</svg>

			<div className="header-text">
				<h1 className="header-title">
					SubText<span className="header-stop">.</span>
				</h1>
				<p className="header-tagline">Subtitles for anything you say</p>
			</div>
		</header>
	);
}

export default Header;
