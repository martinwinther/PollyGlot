import React from "react";
import "./Translator.css";

function Translator() {
	return (
		<div className="translator">
			<input
				type="text"
				placeholder="Text to translate"
				className="translator-input"
			/>
			<div className="language-selector">
				<button className="language-option">French</button>
				<button className="language-option">Spanish</button>
				<button className="language-option">Japanese</button>
			</div>
			<button className="translate-button">Translate</button>
		</div>
	);
}

export default Translator;
