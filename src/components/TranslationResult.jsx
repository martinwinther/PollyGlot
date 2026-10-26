import "./Translator.css";

function TranslationResult({ originalText, translation, onStartOver }) {
	return (
		<div className="translator-card">
			<p className="field-label">
				Original text <span aria-hidden="true">👇</span>
			</p>
			<p className="text-box text-box--readonly">{originalText}</p>

			<p className="field-label">
				Your translation <span aria-hidden="true">👇</span>
			</p>
			<p className="text-box text-box--readonly">{translation}</p>

			<button type="button" className="primary-button" onClick={onStartOver}>
				Start Over
			</button>
		</div>
	);
}

export default TranslationResult;
