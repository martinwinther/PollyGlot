import { useState } from "react";
import Header from "./components/Header";
import Conversation from "./components/Conversation";
import TranslationForm from "./components/TranslationForm";
import { DEFAULT_LANGUAGE, INTRO_MESSAGE } from "./constants";
import "./App.css";

function App() {
	const [text, setText] = useState("");
	const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
	const [messages, setMessages] = useState([INTRO_MESSAGE]);
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

			// Append, so earlier exchanges stay above the new one
			setMessages((previous) => [
				...previous,
				{ id: crypto.randomUUID(), role: "user", text: textToTranslate },
				{ id: crypto.randomUUID(), role: "translation", text: data.translation },
			]);

			// The text now lives in the conversation, so empty the box for the next one
			setText("");
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
		setMessages([INTRO_MESSAGE]);
		setError("");
	}

	// The intro bubble is always present, so anything beyond it is a translation
	const hasTranslation = messages.length > 1;

	return (
		<div className="app">
			<Header />
			<main className="app-body">
				<div className="translator-card">
					<Conversation messages={messages} />
					<TranslationForm
						text={text}
						language={language}
						isLoading={isLoading}
						error={error}
						onTextChange={setText}
						onLanguageChange={setLanguage}
						onSubmit={handleTranslate}
					/>
					{hasTranslation && (
						<button
							type="button"
							className="secondary-button"
							onClick={handleStartOver}
						>
							Start Over
						</button>
					)}
				</div>
			</main>
		</div>
	);
}

export default App;
