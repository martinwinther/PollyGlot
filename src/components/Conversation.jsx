import { useEffect, useRef } from "react";
import "./Conversation.css";

function Conversation({ messages }) {
	const columnRef = useRef(null);

	// Keep the newest bubble in view as the column fills up
	useEffect(() => {
		const column = columnRef.current;
		if (column) {
			column.scrollTop = column.scrollHeight;
		}
	}, [messages]);

	return (
		<div className="conversation" ref={columnRef} role="log" aria-live="polite">
			{messages.map(({ id, role, text }) => (
				<p key={id} className={`bubble bubble--${role}`}>
					{text}
				</p>
			))}
		</div>
	);
}

export default Conversation;
