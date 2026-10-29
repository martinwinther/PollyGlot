import { useState } from "react";
import Header from "./components/Header";
import Conversation from "./components/Conversation";
import Composer from "./components/Composer";
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

		// Show what was sent straight away; the reply lands underneath it
		const userMessage = {
			id: crypto.randomUUID(),
			role: "user",
			text: textToTranslate,
		};
		setMessages((previous) => [...previous, userMessage]);
		setText("");
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
				{ id: crypto.randomUUID(), role: "translation", text: data.translation },
			]);
		} catch (err) {
			// Log the error for debugging
			console.error(err);

			// Take the unanswered bubble back out and hand the text back, so
			// retrying is one keystroke rather than retyping
			setMessages((previous) =>
				previous.filter((message) => message.id !== userMessage.id)
			);
			setText(textToTranslate);

			// Display friendly error message
			setError(
				"Sorry, I can't reach the translator right now. Please try again in a bit."
			);
		} finally {
			setIsLoading(false);
		}
	}

	function handleStartOver() {
		// The chosen language is a preference, not part of the conversation,
		// so it survives a restart
		setText("");
		setMessages([INTRO_MESSAGE]);
		setError("");
	}

	// The intro bubble is always there; anything past it is a real exchange
	const canStartOver = messages.length > 1;

	return (
		<div className="app">
			<Header />
			<main className="app-body">
				<div className="translator-card">
					<Conversation messages={messages} isLoading={isLoading} />
					<Composer
						text={text}
						language={language}
						isLoading={isLoading}
						error={error}
						onTextChange={setText}
						onLanguageChange={setLanguage}
						onSubmit={handleTranslate}
						onStartOver={handleStartOver}
						canStartOver={canStartOver}
					/>
				</div>
			</main>
		</div>
	);
}

export default App;
