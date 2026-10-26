import { LANGUAGES } from "../constants";
import "./Translator.css";

function TranslationForm({
	text,
	language,
	isLoading,
	error,
	onTextChange,
	onLanguageChange,
	onSubmit,
}) {
	return (
		<form className="translator-card" onSubmit={onSubmit}>
			<label className="field-label" htmlFor="text-to-translate">
				Text to translate <span aria-hidden="true">👇</span>
			</label>
			<textarea
				id="text-to-translate"
				className="text-box"
				placeholder="How are you?"
				value={text}
				onChange={(e) => onTextChange(e.target.value)}
			/>

			<fieldset className="language-fieldset">
				<legend className="field-label">
					Select language <span aria-hidden="true">👇</span>
				</legend>
				{LANGUAGES.map(({ name, flag }) => (
					<label key={name} className="language-option">
						<input
							type="radio"
							name="language"
							value={name}
							checked={language === name}
							onChange={(e) => onLanguageChange(e.target.value)}
						/>
						<span className="language-name">{name}</span>
						<img src={flag} alt="" className="language-flag" />
					</label>
				))}
			</fieldset>

			{error && <p className="error-message">{error}</p>}

			<button type="submit" className="primary-button" disabled={isLoading}>
				{isLoading ? "Translating..." : "Translate"}
			</button>
		</form>
	);
}

export default TranslationForm;
