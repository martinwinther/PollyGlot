import { useEffect, useRef } from "react";
import { LANGUAGES } from "../constants";
import "./Composer.css";

function Composer({
	text,
	language,
	isLoading,
	error,
	onTextChange,
	onLanguageChange,
	onSubmit,
	onStartOver,
	canStartOver,
}) {
	const inputRef = useRef(null);

	// Grow the field with its content rather than scrolling inside one line
	useEffect(() => {
		const field = inputRef.current;
		if (!field) return;
		field.style.height = "auto";
		field.style.height = `${field.scrollHeight}px`;
	}, [text]);

	function handleKeyDown(e) {
		// Enter sends; Shift+Enter still makes a new line
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			onSubmit(e);
		}
	}

	return (
		<form className="composer" onSubmit={onSubmit}>
			{error && <p className="error-message">{error}</p>}

			<div className="composer-field">
				<textarea
					ref={inputRef}
					rows={1}
					className="composer-input"
					placeholder="Type a line…"
					aria-label="Text to translate"
					value={text}
					onChange={(e) => onTextChange(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<button
					type="submit"
					className="send-button"
					disabled={isLoading || !text.trim()}
					aria-label="Translate"
				>
					<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
						<path d="M4 12h13M11.5 6l6 6-6 6" />
					</svg>
				</button>
			</div>

			{/* Subtitle track selector: the three flags stay centred, and the
			    rewind is pinned right so it cannot pull them off centre */}
			<div className="composer-footer">
				<div className="track-picker" role="group" aria-label="Select language">
					{LANGUAGES.map(({ name, code, flag }) => (
						<button
							key={name}
							type="button"
							className={`track${language === name ? " track--selected" : ""}`}
							aria-pressed={language === name}
							aria-label={name}
							title={name}
							onClick={() => onLanguageChange(name)}
						>
							<img className="track-flag" src={flag} alt="" />
							<span className="track-code">{code}</span>
						</button>
					))}
				</div>

				<button
					type="button"
					className="restart-button"
					onClick={onStartOver}
					disabled={!canStartOver}
					aria-label="Start over"
					title="Start over"
				>
					<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
						<path d="M20 12a8 8 0 1 1-2.3-5.6" />
						<path d="M20 3.5V8h-4.5" />
					</svg>
				</button>
			</div>
		</form>
	);
}

export default Composer;
