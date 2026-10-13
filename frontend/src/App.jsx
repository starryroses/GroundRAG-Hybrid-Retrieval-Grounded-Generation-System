
import { useState } from "react";
import "./App.css";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import EvidencePanel from "./components/EvidencePanel";
import { queryRAG } from "./services/api";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const query = input.trim();
    if (!query || loading) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: query,
    };

    // Capture the history before adding the new user message.
    const history = messages.map(({ role, content }) => ({
      role,
      content,
    }));

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const result = await queryRAG(query, history);

      const assistantMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.answer,
        citations: result.citations ?? [],
        retrieval_results: result.retrieval_results ?? [],
        grounded: result.grounded,
        grounding_reason: result.grounding_reason,
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Unable to reach the RAG API: ${error.message}`,
          citations: [],
          retrieval_results: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleEvidenceClick(citation) {
    // Find the exact retrieved chunk corresponding to the citation.
    const matchingMessage = [...messages]
      .reverse()
      .find((message) =>
        message.role === "assistant" &&
        message.citations?.some(
          (item) => item.chunk_id === citation.chunk_id
        )
      );

    const retrieval = matchingMessage?.retrieval_results?.find(
      (item) => item.chunk_id === citation.chunk_id
    );

    setSelectedEvidence({ citation, retrieval: retrieval ?? null });
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-mark">R</div>
        <div className="brand-copy">
          <h1>Advanced RAG</h1>
          <p>Hybrid retrieval · Reranking · Grounded answers</p>
        </div>
        <div className="header-status">
          <span className="status-dot" />
          BBC News corpus
        </div>
      </header>

      <main className="workspace">
        <section className="chat-section">
          <div className="section-topbar">
            <div>
              <span className="eyebrow">CONVERSATION</span>
              <h2>Research assistant</h2>
            </div>
            <button
              type="button"
              className="clear-button"
              onClick={() => {
                setMessages([]);
                setSelectedEvidence(null);
              }}
              disabled={messages.length === 0 || loading}
            >
              New chat
            </button>
          </div>

          <ChatWindow
            messages={messages}
            onEvidenceClick={handleEvidenceClick}
          />

          {loading && (
            <div className="loading-indicator">
              <span className="loading-dot" />
              <span className="loading-dot" />
              <span className="loading-dot" />
              <span>Searching sources and verifying evidence…</span>
            </div>
          )}

          <div className="composer-area">
            <ChatInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
            />
            <p className="composer-footnote">
              Answers are restricted to retrieved evidence. Verify important claims against their sources.
            </p>
          </div>
        </section>

        <EvidencePanel
          evidence={selectedEvidence}
          onClose={() => setSelectedEvidence(null)}
        />
      </main>
    </div>
  );
}

export default App;
