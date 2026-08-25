import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";
import API from "../../services/api";
import "./History.css";

export default function History() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 20 };
    if (category !== "all") params.category = category;

    API.get("/progress/history", { params })
      .then((res) => {
        setItems(res.data.items || []);
        setTotal(res.data.total || 0);
        setPages(res.data.pages || 1);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, category]);

  return (
    <div className="hist-page">
      <nav className="hist-breadcrumb">
        <Link to="/dashboard">Dashboard</Link>
        <ChevronRight size={14} />
        <span>History</span>
      </nav>

      <header className="hist-hero">
        <div>
          <p className="hist-eyebrow">Practice log</p>
          <h1>View history</h1>
          <p>All your attempted questions in one place</p>
        </div>
        <Link to="/dashboard" className="hist-back">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>
      </header>

      <div className="hist-toolbar">
        <div className="hist-filters">
          {["all", "aptitude", "reasoning", "english"].map((c) => (
            <button
              key={c}
              type="button"
              className={`hist-chip ${category === c ? "active" : ""}`}
              onClick={() => {
                setCategory(c);
                setPage(1);
              }}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
        <span className="hist-count">{total} attempts</span>
      </div>

      <div className="hist-card">
        {loading && <p className="hist-empty">Loading history…</p>}

        {!loading && items.length === 0 && (
          <p className="hist-empty">No attempts found. Start practicing to build history.</p>
        )}

        {!loading &&
          items.map((item) => (
            <div key={item._id} className="hist-row">
              <div className="hist-row-main">
                <strong>
                  {(item.question?.sub_category || "topic").replace(/_/g, " ")}
                </strong>
                <p>{item.question?.question_text || "Question unavailable"}</p>
                <div className="hist-meta">
                  <span>{item.question?.category || "—"}</span>
                  {item.question?.difficulty && (
                    <span className={`hist-diff hist-diff--${item.question.difficulty}`}>
                      {item.question.difficulty}
                    </span>
                  )}
                  <span>
                    {item.attemptedAt
                      ? new Date(item.attemptedAt).toLocaleString()
                      : ""}
                  </span>
                </div>
              </div>
              <div className="hist-row-actions">
                <em className={item.isCorrect ? "ok" : "bad"}>
                  {item.isCorrect ? "Correct" : "Wrong"}
                </em>
                {item.question?.category && item.question?.sub_category && (
                  <Link
                    to={`/practice/${item.question.category}/${item.question.sub_category}`}
                    className="hist-open"
                  >
                    Open topic
                  </Link>
                )}
              </div>
            </div>
          ))}
      </div>

      {pages > 1 && (
        <div className="hist-pager">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span>
            Page {page} of {pages}
          </span>
          <button
            type="button"
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
