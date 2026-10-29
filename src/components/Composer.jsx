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
					placeholder="How are you?"
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
						<path d="M3 5l17.5 7L3 19l3.6-7L3 5z" />
					</svg>
				</button>
			</div>

			<div className="composer-footer">
				<div
					className="language-picker"
					role="group"
					aria-label="Select language"
				>
					{LANGUAGES.map(({ name, flag }) => (
						<button
							key={name}
							type="button"
							className={`flag-button${
								language === name ? " flag-button--selected" : ""
							}`}
							aria-pressed={language === name}
							aria-label={name}
							title={name}
							onClick={() => onLanguageChange(name)}
						>
							<img src={flag} alt="" />
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
