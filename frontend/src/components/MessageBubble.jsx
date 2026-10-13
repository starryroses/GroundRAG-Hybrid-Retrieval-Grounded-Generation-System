
function renderEvidence(content, citations, onEvidenceClick) {
  const parts = content.split(/(\[Evidence\s+\d+\])/g);

  return parts.map((part, index) => {
    const match = part.match(/^\[Evidence\s+(\d+)\]$/);

    if (!match) {
      return <span key={index}>{part}</span>;
    }

    const citation = citations?.find(
      (item) => String(item.citation_id) === match[1]
    );

    if (!citation) {
      return <span key={index}>{part}</span>;
    }

    return (
      <button
        key={index}
        type="button"
        className="evidence-button"
        onClick={() => onEvidenceClick(citation)}
        title={`Inspect source for Evidence ${match[1]}`}
      >
        <span className="evidence-button-icon">↗</span>
        Evidence {match[1]}
      </button>
    );
  });
}

export default function MessageBubble({
  message,
  onEvidenceClick,
}) {
  const isUser = message.role === "user";

  return (
    <div className={`message-row ${isUser ? "user-row" : "assistant-row"}`}>
      <div className={`message-bubble ${isUser ? "user-bubble" : "assistant-bubble"}`}>
        <div className="message-label">
          {isUser ? "You" : "Assistant"}
        </div>

        <div className="message-content">
          {isUser
            ? message.content
            : renderEvidence(
                message.content,
                message.citations,
                onEvidenceClick
              )}
        </div>

        {!isUser && message.grounded === false && (
          <div className="grounding-note">
            <span>ⓘ</span>
            Answer not verified against the available evidence.
          </div>
        )}
      </div>
    </div>
  );
}
