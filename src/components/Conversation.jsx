import { useEffect, useRef } from "react";
import "./Conversation.css";

function Conversation({ messages, isLoading, language }) {
	const columnRef = useRef(null);

	// Keep the newest cue in view as the column fills up
	useEffect(() => {
		const column = columnRef.current;
		if (column) {
			column.scrollTop = column.scrollHeight;
		}
	}, [messages, isLoading]);

	return (
		<div className="cues" ref={columnRef} role="log" aria-live="polite">
			{messages.map((message) => (
				<div key={message.id} className={`cue cue--${message.role}`}>
					{message.role === "translation" && (
						<span className="cue-label">{message.language}</span>
					)}
					<p className="cue-text">{message.text}</p>
				</div>
			))}

			{isLoading && (
				<div className="cue cue--translation">
					<span className="cue-label">{language}</span>
					<p className="cue-text cue-text--typing">
						<span className="sr-only">Translating</span>
						<span className="dot" aria-hidden="true" />
						<span className="dot" aria-hidden="true" />
						<span className="dot" aria-hidden="true" />
					</p>
				</div>
			)}
		</div>
	);
}

export default Conversation;
