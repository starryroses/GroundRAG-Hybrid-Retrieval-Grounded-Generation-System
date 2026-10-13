
import MessageBubble from "./MessageBubble";

export default function ChatWindow({
  messages,
  onEvidenceClick,
}) {
  return (
    <section className="chat-window">
      {messages.length === 0 ? (
        <div className="welcome-state">
          <span className="eyebrow">BBC NEWS KNOWLEDGE BASE</span>
          <h2>Ask a question.<br />Follow the evidence.</h2>
          <p>
            Explore answers grounded in indexed BBC News articles.
            Inspect the sources behind each response.
          </p>

          <div className="welcome-hint">
            Try asking about business, politics, technology,
            sport, or entertainment.
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onEvidenceClick={onEvidenceClick}
          />
        ))
      )}
    </section>
  );
}
