import { useEffect, useRef } from "react";
import "./Conversation.css";

function Conversation({ messages, isLoading }) {
	const columnRef = useRef(null);

	// Keep the newest bubble in view as the column fills up
	useEffect(() => {
		const column = columnRef.current;
		if (column) {
			column.scrollTop = column.scrollHeight;
		}
	}, [messages, isLoading]);

	return (
		<div className="conversation" ref={columnRef} role="log" aria-live="polite">
			{messages.map(({ id, role, text }) => (
				<p key={id} className={`bubble bubble--${role}`}>
					{text}
				</p>
			))}
			{isLoading && (
				<p className="bubble bubble--translation bubble--typing">
					<span className="sr-only">Translating</span>
					<span className="dot" aria-hidden="true" />
					<span className="dot" aria-hidden="true" />
					<span className="dot" aria-hidden="true" />
				</p>
			)}
		</div>
	);
}

export default Conversation;
