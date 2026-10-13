
function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value ?? "—"}</strong>
    </div>
  );
}

export default function EvidencePanel({ evidence, onClose }) {
  if (!evidence) {
    return (
      <aside className="evidence-panel empty">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">RAG INSPECTOR</span>
            <h2>Evidence explorer</h2>
          </div>
        </div>

        <div className="inspector-empty">
          <div className="inspector-icon">⌕</div>
          <h3>Inspect your evidence</h3>
          <p>
            Click an Evidence button in an answer to inspect its
            source text, retrieval rankings, and scores.
          </p>
        </div>
      </aside>
    );
  }

  const { citation, retrieval } = evidence;
  const metadata = retrieval?.metadata ?? {};

  return (
    <aside className="evidence-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">RAG INSPECTOR</span>
          <h2>Evidence details</h2>
        </div>
        <button
          className="icon-button close-inspector"
          onClick={onClose}
          aria-label="Close evidence inspector"
        >
          ×
        </button>
      </div>

      <div className="evidence-content">
        <div className="source-badges">
          <span className="source-badge">
            {metadata.category ?? citation.category ?? "Unknown category"}
          </span>
          <span className="source-badge">
            Evidence {citation.citation_id}
          </span>
        </div>

        <h3 className="source-title">
          {metadata.title ?? citation.document_name}
        </h3>

        <p className="source-file">
          {citation.document_name}
        </p>

        <section className="inspector-section">
          <h4>Source text</h4>
          <div className="source-text">
            {citation.text}
          </div>
        </section>

        <section className="inspector-section">
          <h4>Retrieval performance</h4>
          <p className="section-description">
            Scores are specific to this query. They are not probabilities.
          </p>

          <div className="metrics-grid">
            <Metric
              label="BM25 rank"
              value={retrieval?.bm25_rank}
            />
            <Metric
              label="BM25 score"
              value={retrieval?.bm25_score?.toFixed(4)}
            />
            <Metric
              label="Dense rank"
              value={retrieval?.dense_rank}
            />
            <Metric
              label="Dense score"
              value={retrieval?.dense_score?.toFixed(4)}
            />
            <Metric
              label="Fusion rank"
              value={retrieval?.fusion_rank}
            />
            <Metric
              label="Fusion score"
              value={retrieval?.fusion_score?.toFixed(6)}
            />
            <Metric
              label="Reranker rank"
              value={retrieval?.reranker_rank}
            />
            <Metric
              label="Reranker score"
              value={retrieval?.reranker_score?.toFixed(4)}
            />
            <Metric
              label="Dense distance"
              value={retrieval?.dense_distance?.toFixed(4)}
            />
          </div>
        </section>

        <section className="inspector-section">
          <h4>Chunk metadata</h4>
          <div className="metadata-list">
            <div>
              <span>Chunk ID</span>
              <code>{citation.chunk_id}</code>
            </div>
            <div>
              <span>Document ID</span>
              <code>{metadata.document_id ?? "—"}</code>
            </div>
            <div>
              <span>Chunk index</span>
              <code>{metadata.chunk_index ?? "—"}</code>
            </div>
            <div>
              <span>Category</span>
              <code>{citation.category ?? metadata.category ?? "—"}</code>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}
