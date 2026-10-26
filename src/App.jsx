import { useState } from "react";
import Header from "./components/Header";
import TranslationForm from "./components/TranslationForm";
import TranslationResult from "./components/TranslationResult";
import { DEFAULT_LANGUAGE } from "./constants";
import "./App.css";

function App() {
	const [text, setText] = useState("");
	const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
	const [translation, setTranslation] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	async function handleTranslate(e) {
		// Prevent default form submission
		e.preventDefault();

		// Get user input, trim whitespace, exit if empty
		const textToTranslate = text.trim();
		if (!textToTranslate) return;

		setIsLoading(true);
		setError("");

		try {
			// Send fetch request to /api/translate
			const response = await fetch("/api/translate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text: textToTranslate, language }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message);
			}

			// Switching to the result view is driven by this state
			setTranslation(data.translation);
		} catch (err) {
			// Log the error for debugging
			console.error(err);

			// Display friendly error message
			setError(
				"Sorry, I can't reach the translator right now. Please try again in a bit."
			);
		} finally {
			setIsLoading(false);
		}
	}

	function handleStartOver() {
		setText("");
		setLanguage(DEFAULT_LANGUAGE);
		setTranslation("");
		setError("");
	}

	return (
		<div className="app">
			<Header />
			<main className="app-body">
				{translation ? (
					<TranslationResult
						originalText={text}
						translation={translation}
						onStartOver={handleStartOver}
					/>
				) : (
					<TranslationForm
						text={text}
						language={language}
						isLoading={isLoading}
						error={error}
						onTextChange={setText}
						onLanguageChange={setLanguage}
						onSubmit={handleTranslate}
					/>
				)}
			</main>
		</div>
	);
}

export default App;
