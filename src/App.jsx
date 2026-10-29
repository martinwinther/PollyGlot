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

		// Identifies the bubble the stream writes into, so each chunk updates
		// that one rather than appending a new bubble per chunk
		const translationId = crypto.randomUUID();

		// A message the server chose to send; preferred over the generic one
		let serverMessage = null;

		try {
			// Send fetch request to /api/translate
			const response = await fetch("/api/translate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text: textToTranslate, language }),
			});

			// A failure before the stream opens still arrives as plain JSON
			if (!response.ok) {
				const data = await response.json();
				serverMessage = data.message;
				throw new Error(data.message);
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let buffer = "";
			let streamed = "";

			let chunk = await reader.read();

			while (!chunk.done) {
				buffer += decoder.decode(chunk.value, { stream: true });

				// A chunk can split a line in half, so hold the tail back until
				// the newline that completes it arrives
				const lines = buffer.split("\n");
				buffer = lines.pop() ?? "";

				for (const line of lines) {
					if (!line.trim()) continue;

					const payload = JSON.parse(line);

					if (payload.error) {
						serverMessage = payload.error;
						throw new Error(payload.error);
					}

					const isFirstChunk = streamed === "";
					streamed += payload.delta;

					if (isFirstChunk) {
						// The cue replaces the waiting dots
						setIsLoading(false);
						setMessages((previous) => [
							...previous,
							{
								id: translationId,
								role: "translation",
								language,
								text: streamed,
							},
						]);
					} else {
						setMessages((previous) =>
							previous.map((message) =>
								message.id === translationId
									? { ...message, text: streamed }
									: message
							)
						);
					}
				}

				chunk = await reader.read();
			}
		} catch (err) {
			// Log the error for debugging
			console.error(err);

			// Take the unanswered bubble and any half-written translation back
			// out, and hand the text back, so retrying is one keystroke
			setMessages((previous) =>
				previous.filter(
					(message) =>
						message.id !== userMessage.id && message.id !== translationId
				)
			);
			setText(textToTranslate);

			// Display friendly error message
			setError(
				serverMessage ??
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

	// The intro cue is always there; anything past it is a real exchange
	const canStartOver = messages.length > 1;

	return (
		<div className="app">
			<Header />
			<main className="app-body">
				<div className="stage">
					<Conversation
						messages={messages}
						isLoading={isLoading}
						language={language}
					/>
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
