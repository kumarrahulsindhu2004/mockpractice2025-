import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Target,
  CheckCircle2,
  Percent,
  Layers,
  ArrowUpRight,
  Calculator,
  Brain,
  BookOpen,
} from "lucide-react";
import API from "../../services/api";
import "./Dashboard.css";

const CAT_META = {
  aptitude: { title: "Aptitude", Icon: Calculator, tone: "aptitude" },
  reasoning: { title: "Reasoning", Icon: Brain, tone: "reasoning" },
  english: { title: "English", Icon: BookOpen, tone: "english" },
};

function accuracyOf(correct, attempted) {
  if (!attempted) return 0;
  return Math.round((correct / attempted) * 100);
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [hub, setHub] = useState(null);
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topicFilter, setTopicFilter] = useState("all");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [profileRes, hubRes, summaryRes, recentRes] = await Promise.all([
          API.get("/user/profile"),
          API.get("/progress/hub"),
          API.get("/question/hub-summary"),
          API.get("/progress/my"),
        ]);

        if (cancelled) return;

        setUser(profileRes.data.user);
        setHub(hubRes.data);
        setSummary(summaryRes.data);
        setRecent(recentRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const overview = useMemo(() => {
    const totals = hub?.totals || { attempted: 0, correct: 0, accuracy: 0 };
    const bank = summary?.totals || { questions: 0, topics: 0 };
    const remaining = Math.max(0, bank.questions - totals.attempted);
    return {
      ...totals,
      questions: bank.questions,
      topics: bank.topics,
      remaining,
      wrong: Math.max(0, totals.attempted - totals.correct),
    };
  }, [hub, summary]);

  const categoryRows = useMemo(() => {
    const cats = summary?.categories || [];
    return ["aptitude", "reasoning", "english"].map((name) => {
      const bank = cats.find((c) => c.name === name);
      const prog = hub?.byCategory?.[name] || { attempted: 0, correct: 0 };
      const total = bank?.totalQuestions || 0;
      const attempted = prog.attempted || 0;
      const correct = prog.correct || 0;
      return {
        name,
        total,
        topics: bank?.topicCount || 0,
        attempted,
        correct,
        remaining: Math.max(0, total - attempted),
        accuracy: accuracyOf(correct, attempted),
        pct: total ? Math.round((attempted / total) * 100) : 0,
      };
    });
  }, [hub, summary]);

  const topicRows = useMemo(() => {
    const bankTopics = [];
    (summary?.categories || []).forEach((cat) => {
      (cat.topics || []).forEach((t) => {
        bankTopics.push({
          category: cat.name,
          name: t.name,
          display_name: t.display_name,
          total: t.count,
          difficulty: t.difficulty,
        });
      });
    });

    const progressMap = {};
    (hub?.bySubcategory || []).forEach((p) => {
      progressMap[`${p.category}::${p.sub_category}`] = p;
    });

    return bankTopics
      .map((t) => {
        const prog = progressMap[`${t.category}::${t.name}`] || {
          attempted: 0,
          correct: 0,
        };
        const attempted = prog.attempted || 0;
        const correct = prog.correct || 0;
        return {
          ...t,
          attempted,
          correct,
          remaining: Math.max(0, t.total - attempted),
          accuracy: accuracyOf(correct, attempted),
          pct: t.total ? Math.round((attempted / t.total) * 100) : 0,
        };
      })
      .filter((t) => topicFilter === "all" || t.category === topicFilter)
      .sort((a, b) => {
        if (b.attempted !== a.attempted) return b.attempted - a.attempted;
        return a.display_name.localeCompare(b.display_name);
      });
  }, [hub, summary, topicFilter]);

  if (loading) {
    return (
      <div className="dash">
        <p className="dash-loading">Loading your dashboard…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dash">
        <p className="dash-loading">Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="dash">
      {/* Header */}
      <header className="dash-header">
        <div className="dash-header-text">
          <p className="dash-eyebrow">Overview</p>
          <h1>Welcome back, {user.name}</h1>
          <p className="dash-lead">
            Track your practice across aptitude, reasoning, and English.
          </p>
        </div>
        <div className="dash-header-actions">
          <Link to="/practice" className="dash-cta">
            Continue practice <ArrowUpRight size={16} />
          </Link>
          <Link to="/history" className="dash-cta dash-cta--ghost">
            View history
          </Link>
          <Link to="/profile" className="dash-cta dash-cta--ghost">
            Profile
          </Link>
        </div>
      </header>

      {/* 1) Overall overview */}
      <section className="dash-section">
        <div className="dash-section-head">
          <h2>Overall overview</h2>
          <p>Your complete practice snapshot</p>
        </div>

        <div className="dash-overview">
          <div className="dash-kpis">
            <article className="dash-kpi">
              <span className="dash-kpi-icon">
                <Layers size={18} />
              </span>
              <div>
                <strong>{overview.questions.toLocaleString()}</strong>
                <span>Bank questions</span>
              </div>
            </article>
            <article className="dash-kpi">
              <span className="dash-kpi-icon">
                <Target size={18} />
              </span>
              <div>
                <strong>{overview.attempted}</strong>
                <span>Attempted</span>
              </div>
            </article>
            <article className="dash-kpi">
              <span className="dash-kpi-icon ok">
                <CheckCircle2 size={18} />
              </span>
              <div>
                <strong>{overview.correct}</strong>
                <span>Correct</span>
              </div>
            </article>
            <article className="dash-kpi">
              <span className="dash-kpi-icon">
                <Percent size={18} />
              </span>
              <div>
                <strong>{overview.remaining}</strong>
                <span>Remaining</span>
              </div>
            </article>
          </div>

          <div className="dash-accuracy-card">
            <div className="dash-ring" aria-hidden>
              <svg viewBox="0 0 36 36">
                <path
                  className="dash-ring-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="dash-ring-fg"
                  strokeDasharray={`${overview.accuracy}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="dash-ring-label">
                <strong>{overview.accuracy}%</strong>
                <span>Accuracy</span>
              </div>
            </div>
            <div className="dash-accuracy-meta">
              <h3>Overall accuracy</h3>
              <p>
                {overview.correct} correct out of {overview.attempted} attempts
                {overview.wrong > 0 ? ` · ${overview.wrong} wrong` : ""}
              </p>
              <div className="dash-mini-bars">
                <div>
                  <span>Correct</span>
                  <div className="dash-track">
                    <i
                      className="ok"
                      style={{
                        width: `${
                          overview.attempted
                            ? Math.round(
                                (overview.correct / overview.attempted) * 100
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <span>Wrong</span>
                  <div className="dash-track">
                    <i
                      className="bad"
                      style={{
                        width: `${
                          overview.attempted
                            ? Math.round(
                                (overview.wrong / overview.attempted) * 100
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2) Category analysis */}
      <section className="dash-section">
        <div className="dash-section-head">
          <h2>Category analysis</h2>
          <p>Aptitude, Reasoning & English breakdown</p>
        </div>

        <div className="dash-cat-grid">
          {categoryRows.map((cat) => {
            const meta = CAT_META[cat.name];
            const Icon = meta.Icon;
            return (
              <article
                key={cat.name}
                className={`dash-cat-card dash-cat-card--${meta.tone}`}
              >
                <div className="dash-cat-top">
                  <span className="dash-cat-icon">
                    <Icon size={20} strokeWidth={1.75} />
                  </span>
                  <Link to={`/practice/${cat.name}`} className="dash-cat-link">
                    Open <ArrowUpRight size={14} />
                  </Link>
                </div>
                <h3>{meta.title}</h3>
                <p className="dash-cat-sub">
                  {cat.topics} topics · {cat.total} questions
                </p>

                <div className="dash-cat-stats">
                  <div>
                    <strong>{cat.attempted}</strong>
                    <span>Attempted</span>
                  </div>
                  <div>
                    <strong>{cat.correct}</strong>
                    <span>Correct</span>
                  </div>
                  <div>
                    <strong>{cat.remaining}</strong>
                    <span>Left</span>
                  </div>
                  <div>
                    <strong>{cat.accuracy}%</strong>
                    <span>Accuracy</span>
                  </div>
                </div>

                <div className="dash-cat-progress">
                  <div className="dash-cat-progress-top">
                    <span>Completion</span>
                    <strong>{cat.pct}%</strong>
                  </div>
                  <div className="dash-track">
                    <i style={{ width: `${Math.min(100, cat.pct)}%` }} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 3) Sub-category analysis */}
      <section className="dash-section">
        <div className="dash-section-head dash-section-head--row">
          <div>
            <h2>Sub-category analysis</h2>
            <p>Topic-wise progress across the question bank</p>
          </div>
          <div className="dash-topic-filters">
            {["all", "aptitude", "reasoning", "english"].map((f) => (
              <button
                key={f}
                type="button"
                className={`dash-chip ${topicFilter === f ? "active" : ""}`}
                onClick={() => setTopicFilter(f)}
              >
                {f === "all" ? "All" : CAT_META[f].title}
              </button>
            ))}
          </div>
        </div>

        <div className="dash-table">
          <div className="dash-table-head">
            <span>Topic</span>
            <span>Category</span>
            <span>Attempted</span>
            <span>Correct</span>
            <span>Left</span>
            <span>Accuracy</span>
            <span>Progress</span>
          </div>

          {topicRows.length === 0 && (
            <p className="dash-empty">No topics found for this filter.</p>
          )}

          {topicRows.map((row) => (
            <Link
              key={`${row.category}-${row.name}`}
              to={`/practice/${row.category}/${row.name}`}
              className="dash-table-row"
            >
              <span className="dash-topic-name">
                <strong>{row.display_name}</strong>
                <em>{row.total} questions</em>
              </span>
              <span className="dash-cat-pill" data-label="Category">
                {row.category}
              </span>
              <span data-label="Attempted">{row.attempted}</span>
              <span data-label="Correct">{row.correct}</span>
              <span data-label="Left">{row.remaining}</span>
              <span data-label="Accuracy">{row.accuracy}%</span>
              <span className="dash-row-progress" data-label="Progress">
                <span className="dash-track">
                  <i style={{ width: `${Math.min(100, row.pct)}%` }} />
                </span>
                <b>{row.pct}%</b>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent + profile */}
      <section className="dash-bottom">
        <div className="dash-panel">
          <div className="dash-section-head dash-section-head--row">
            <div>
              <h2>Recent practice</h2>
              <p>Your latest attempts</p>
            </div>
            <Link to="/history" className="dash-link">
              View all
            </Link>
          </div>

          {recent.length === 0 ? (
            <p className="dash-empty">No recent activity yet.</p>
          ) : (
            <div className="dash-recent">
              {recent.map((item, idx) => (
                <div key={idx} className="dash-recent-item">
                  <div>
                    <strong>
                      {(item.question?.sub_category || "topic").replace(
                        /_/g,
                        " "
                      )}
                    </strong>
                    <span>{item.question?.category || "—"}</span>
                  </div>
                  <em className={item.isCorrect ? "ok" : "bad"}>
                    {item.isCorrect ? "Correct" : "Wrong"}
                  </em>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dash-panel">
          <div className="dash-section-head dash-section-head--row">
            <div>
              <h2>Profile</h2>
              <p>Account details</p>
            </div>
            <Link to="/profile" className="dash-link">
              Open profile
            </Link>
          </div>
          <div className="dash-profile-grid">
            <div>
              <span>Name</span>
              <strong>{user.name}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>
            <div>
              <span>Role</span>
              <strong>{user.role || "student"}</strong>
            </div>
            <div>
              <span>Topics in bank</span>
              <strong>{overview.topics}</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
