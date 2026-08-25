import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  ArrowLeft,
  Calculator,
  Brain,
  BookOpen,
} from "lucide-react";
import API from "../../../services/api";
import { usePracticeHub } from "./PracticeLayout";
import "./PracticeSubcategories.css";

const META = {
  aptitude: { title: "Aptitude", Icon: Calculator, tone: "aptitude" },
  reasoning: { title: "Reasoning", Icon: Brain, tone: "reasoning" },
  english: { title: "English", Icon: BookOpen, tone: "english" },
};

export default function PracticeSubcategories() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { progress, summary, loading: hubLoading } = usePracticeHub();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const meta = META[category] || {
    title: category,
    Icon: BookOpen,
    tone: "aptitude",
  };
  const Icon = meta.Icon;

  useEffect(() => {
    setLoading(true);
    API.get(`/question/subcategory?category=${category}`)
      .then((res) => setTopics(res.data || []))
      .catch((err) => {
        console.error(err);
        const fromSummary =
          summary?.categories?.find((c) => c.name === category)?.topics || [];
        setTopics(fromSummary);
      })
      .finally(() => setLoading(false));
  }, [category, summary]);

  const rows = useMemo(() => {
    return (topics || []).map((topic) => {
      const subKeyProgress = (progress?.bySubcategory || []).find(
        (p) =>
          p.category === category &&
          p.sub_category === (topic.name || "general")
      );
      const attempted = subKeyProgress?.attempted || 0;
      const correct = subKeyProgress?.correct || 0;
      const total = topic.count || 0;
      const remaining = Math.max(0, total - attempted);
      const pct = total > 0 ? Math.round((attempted / total) * 100) : 0;

      return {
        name: topic.name,
        display_name: topic.display_name,
        count: total,
        attempted,
        correct,
        remaining,
        pct,
        difficulty: topic.difficulty || "medium",
      };
    });
  }, [topics, progress, category]);

  const categoryProgress = progress?.byCategory?.[category];
  const categorySummary = summary?.categories?.find((c) => c.name === category);
  const totalQ = categorySummary?.totalQuestions || 0;
  const attempted = categoryProgress?.attempted || 0;
  const remaining = Math.max(0, totalQ - attempted);
  const pct = totalQ > 0 ? Math.round((attempted / totalQ) * 100) : 0;

  if (hubLoading || loading) {
    return <p className="topic-list-status">Loading topics…</p>;
  }

  if (!rows.length) {
    return (
      <div className="topic-page">
        <Link to="/practice" className="topic-back">
          <ArrowLeft size={16} /> Back to Practice Hub
        </Link>
        <p className="topic-list-status">
          No topics found for {meta.title}. Add questions with a sub_category in
          the database.
        </p>
      </div>
    );
  }

  return (
    <div className={`topic-page topic-page--${meta.tone}`}>
      <nav className="topic-breadcrumb" aria-label="Breadcrumb">
        <Link to="/practice">Practice</Link>
        <ChevronRight size={14} />
        <span>{meta.title}</span>
      </nav>

      <header className="topic-page-header">
        <div className="topic-page-title">
          <span className="topic-page-icon">
            <Icon size={24} strokeWidth={1.75} />
          </span>
          <div>
            <h1>{meta.title}</h1>
            <p>
              {rows.length} topics · {totalQ.toLocaleString()} questions ·{" "}
              {remaining} remaining
            </p>
          </div>
        </div>

        <div className="topic-page-progress">
          <div className="topic-page-progress-top">
            <span>Your progress</span>
            <strong>{pct}%</strong>
          </div>
          <div className="topic-page-progress-bar" aria-hidden>
            <span style={{ width: `${Math.min(100, pct)}%` }} />
          </div>
          <div className="topic-page-kpis">
            <span>
              <b>{attempted}</b> attempted
            </span>
            <span>
              <b>{categoryProgress?.correct ?? 0}</b> correct
            </span>
            <span>
              <b>{remaining}</b> left
            </span>
          </div>
        </div>
      </header>

      <div className="topic-table">
        <div className="topic-table-head">
          <span>Topic</span>
          <span>Difficulty</span>
          <span>Progress</span>
          <span>Left</span>
          <span className="sr-only">Open</span>
        </div>

        {rows.map((row) => (
          <button
            key={row.name}
            type="button"
            className="topic-table-row"
            onClick={() => navigate(`/practice/${category}/${row.name}`)}
          >
            <span className="topic-cell-name">
              <span className="topic-name">{row.display_name}</span>
              <span className="topic-meta">
                {row.count} questions
                {row.attempted > 0
                  ? ` · ${row.attempted} done · ${row.correct} correct`
                  : ""}
              </span>
            </span>

            <span className={`topic-diff topic-diff--${row.difficulty}`}>
              {row.difficulty}
            </span>

            <span className="topic-cell-progress">
              <span className="mini-bar" aria-hidden>
                <span style={{ width: `${Math.min(100, row.pct)}%` }} />
              </span>
              <span className="mini-bar-label">{row.pct}%</span>
            </span>

            <span className="topic-left">{row.remaining}</span>
            <ChevronRight size={18} className="topic-chevron" aria-hidden />
          </button>
        ))}
      </div>
    </div>
  );
}
