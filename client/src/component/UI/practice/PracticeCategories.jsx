import { useNavigate } from "react-router-dom";
import { Calculator, Brain, BookOpen, ArrowUpRight } from "lucide-react";
import { usePracticeHub } from "./PracticeLayout";
import "./PracticeCategories.css";

const META = {
  aptitude: {
    title: "Aptitude",
    subtitle: "Quantitative problem solving",
    Icon: Calculator,
    tone: "aptitude",
  },
  reasoning: {
    title: "Reasoning",
    subtitle: "Logical thinking & puzzles",
    Icon: Brain,
    tone: "reasoning",
  },
  english: {
    title: "English",
    subtitle: "Grammar & comprehension",
    Icon: BookOpen,
    tone: "english",
  },
};

export default function PracticeCategories() {
  const navigate = useNavigate();
  const { summary, progress, loading } = usePracticeHub();

  if (loading) {
    return <p className="hub-loading">Loading practice data…</p>;
  }

  const categories = summary?.categories || [];

  if (!categories.length) {
    return (
      <p className="hub-loading">
        No practice categories found. Add aptitude, reasoning, or english
        questions to get started.
      </p>
    );
  }

  return (
    <section className="category-grid">
      {categories.map((cat) => {
        const meta = META[cat.name] || {
          title: cat.name,
          subtitle: "Practice questions",
          Icon: BookOpen,
          tone: "aptitude",
        };
        const Icon = meta.Icon;
        const user = progress?.byCategory?.[cat.name] || {
          attempted: 0,
          correct: 0,
        };
        const total = cat.totalQuestions || 0;
        const done = user.attempted || 0;
        const remaining = Math.max(0, total - done);
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;

        return (
          <button
            key={cat.name}
            type="button"
            className={`category-card category-card--${meta.tone}`}
            onClick={() => navigate(`/practice/${cat.name}`)}
            disabled={total === 0}
          >
            <div className="category-card-top">
              <span className="category-card-icon">
                <Icon size={22} strokeWidth={1.75} />
              </span>
              <ArrowUpRight size={18} className="category-card-go" />
            </div>

            <h3>{meta.title}</h3>
            <p>{meta.subtitle}</p>

            <div className="category-card-stats">
              <div>
                <strong>{total}</strong>
                <span>Questions</span>
              </div>
              <div>
                <strong>{cat.topicCount}</strong>
                <span>Topics</span>
              </div>
              <div>
                <strong>{remaining}</strong>
                <span>Left</span>
              </div>
            </div>

            <div className="category-card-footer">
              <div className="category-progress-bar" aria-hidden>
                <span style={{ width: `${Math.min(100, pct)}%` }} />
              </div>
              <span className="category-progress-label">
                {total === 0
                  ? "No questions yet"
                  : `${done} attempted · ${pct}% complete`}
              </span>
            </div>
          </button>
        );
      })}
    </section>
  );
}
