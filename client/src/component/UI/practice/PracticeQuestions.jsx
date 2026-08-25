import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  X,
  Circle,
  ChevronRight,
  Target,
  CheckCircle2,
  CircleDashed,
  Percent,
} from "lucide-react";
import API from "../../../services/api";
import "./PracticeQuestions.css";

export default function PracticeQuestions() {
  const { category, subcategory } = useParams();

  const [questions, setQuestions] = useState([]);
  const [totalInTopic, setTotalInTopic] = useState(0);
  const [attempted, setAttempted] = useState({});
  const [showExp, setShowExp] = useState({});
  const [justAnsweredIds, setJustAnsweredIds] = useState(new Set());
  const [attemptedIds, setAttemptedIds] = useState(new Set());
  const [filters, setFilters] = useState({
    status: "unsolved",
    difficulty: [],
  });

  const topicLabel = (subcategory || "").replace(/_/g, " ");

  useEffect(() => {
    API.get("/progress/attempted")
      .then((res) => setAttemptedIds(new Set(res.data || [])))
      .catch(console.error);
  }, []);

  useEffect(() => {
    API.get("/progress/attempts", {
      params: { category, sub_category: subcategory },
    })
      .then((res) => setAttempted(res.data || {}))
      .catch(console.error);

    // Full topic total (ignore difficulty filter) for sidebar
    API.get(
      `/question?category=${category}&sub_category=${subcategory}&limit=1`
    )
      .then((res) => {
        const total = Array.isArray(res.data)
          ? res.data.length
          : res.data?.total ?? 0;
        setTotalInTopic(total);
      })
      .catch(console.error);
  }, [category, subcategory]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.append("category", category);
    params.append("sub_category", subcategory);
    params.append("limit", "100");
    if (filters.difficulty.length) {
      params.append("difficulty", filters.difficulty.join(","));
    }

    API.get(`/question?${params.toString()}`)
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.questions || [];
        setQuestions(list);
      })
      .catch(console.error);
  }, [category, subcategory, filters.difficulty]);

  const handleAnswer = async (q, selectedIdx) => {
    if (attempted[q._id] !== undefined) return;
    if (filters.status === "solved") return;

    try {
      const res = await API.post("/progress", {
        questionId: q._id,
        selectedOptionIndex: selectedIdx,
      });

      const { isCorrect, correctIndex, explanation } = res.data;

      setAttempted((prev) => ({
        ...prev,
        [q._id]: {
          selectedOptionIndex: selectedIdx,
          correctIndex,
          isCorrect,
          explanation,
        },
      }));
      setJustAnsweredIds((prev) => new Set(prev).add(q._id));
      setAttemptedIds((prev) => new Set(prev).add(q._id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDifficulty = (value) => {
    setFilters((prev) => ({
      ...prev,
      difficulty: prev.difficulty.includes(value)
        ? prev.difficulty.filter((v) => v !== value)
        : [...prev.difficulty, value],
    }));
  };

  const setStatus = (status) => {
    setFilters((prev) => ({ ...prev, status }));
    setJustAnsweredIds(new Set());
  };

  const isAttempted = (id) =>
    attemptedIds.has(id) || attempted[id] !== undefined;

  const filteredQuestions = questions.filter((q) => {
    const id = q._id;
    const done = isAttempted(id);

    if (filters.status === "unsolved") {
      if (justAnsweredIds.has(id)) return true;
      return !done;
    }
    return done;
  });

  const topicStats = useMemo(() => {
    const attemptList = Object.values(attempted);
    const solved = attemptList.filter((a) => a.isCorrect).length;
    const attemptedCount = attemptList.length;
    const remaining = Math.max(0, totalInTopic - attemptedCount);
    const accuracy =
      attemptedCount === 0
        ? 0
        : Math.round((solved / attemptedCount) * 100);

    return {
      total: totalInTopic,
      attempted: attemptedCount,
      solved,
      remaining,
      accuracy,
    };
  }, [attempted, totalInTopic]);

  const optionClass = (attempt, idx) => {
    const classes = ["option"];
    if (!attempt) return classes.join(" ");

    const { selectedOptionIndex, correctIndex } = attempt;
    if (idx === correctIndex) classes.push("correct");
    else if (idx === selectedOptionIndex) classes.push("wrong", "selected");
    else classes.push("disabled");

    if (idx === selectedOptionIndex) classes.push("selected");
    return classes.join(" ");
  };

  return (
    <div className="pq-page">
      <nav className="pq-breadcrumb" aria-label="Breadcrumb">
        <Link to="/practice">Practice</Link>
        <ChevronRight size={14} />
        <Link to={`/practice/${category}`}>{category}</Link>
        <ChevronRight size={14} />
        <span>{topicLabel}</span>
      </nav>

      {/* Top filter bar */}
      <div className="pq-filterbar">
        <div className="pq-filter-group">
          <span className="pq-filter-label">Status</span>
          <div className="pq-pills" role="tablist">
            <button
              type="button"
              className={`pq-pill ${filters.status === "unsolved" ? "active" : ""}`}
              onClick={() => setStatus("unsolved")}
            >
              Unsolved
            </button>
            <button
              type="button"
              className={`pq-pill ${filters.status === "solved" ? "active" : ""}`}
              onClick={() => setStatus("solved")}
            >
              Solved
            </button>
          </div>
        </div>

        <div className="pq-filter-divider" aria-hidden />

        <div className="pq-filter-group">
          <span className="pq-filter-label">Difficulty</span>
          <div className="pq-pills">
            {["easy", "medium", "hard"].map((d) => (
              <button
                key={d}
                type="button"
                className={`pq-pill pq-pill--${d} ${
                  filters.difficulty.includes(d) ? "active" : ""
                }`}
                onClick={() => toggleDifficulty(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pq-workspace">
        {/* Center: MCQs */}
        <main className="pq-main">
          <div className="pq-main-head">
            <h1>{topicLabel}</h1>
            <span className={`pq-mode pq-mode--${filters.status}`}>
              {filters.status === "unsolved" ? "Unsolved" : "Solved"}
            </span>
          </div>

          {filteredQuestions.length === 0 && (
            <div className="pq-empty">
              {filters.status === "unsolved"
                ? "No new questions left. Switch to Solved to review attempts."
                : "No solved questions yet. Attempt some from Unsolved."}
            </div>
          )}

          {filteredQuestions.map((q, i) => {
            const attempt = attempted[q._id];
            const answered = attempt !== undefined;
            const explanation =
              attempt?.explanation ||
              q.explanation ||
              "No explanation provided.";
            const reviewMode = filters.status === "solved";

            return (
              <article
                key={q._id}
                className={`pq-card ${answered ? "answered" : ""}`}
              >
                <div className="pq-card-head">
                  <span className="pq-qnum">Q{i + 1}</span>
                  <div className="pq-card-tags">
                    {answered && (
                      <span
                        className={`pq-result ${
                          attempt.isCorrect ? "ok" : "bad"
                        }`}
                      >
                        {attempt.isCorrect ? "Correct" : "Wrong"}
                      </span>
                    )}
                    <span className={`pq-diff pq-diff--${q.difficulty}`}>
                      {q.difficulty}
                    </span>
                  </div>
                </div>

                <p className="pq-question">{q.question_text}</p>

                {q.tags?.length > 0 && (
                  <div className="pq-asked">
                    <span>Asked in</span>
                    {q.tags.map((t, idx) => (
                      <em key={idx}>{t}</em>
                    ))}
                  </div>
                )}

                <div className="pq-options" role="listbox">
                  {q.options.map((opt, idx) => {
                    const isCorrect = answered && idx === attempt.correctIndex;
                    const isSelected =
                      answered && idx === attempt.selectedOptionIndex;

                    return (
                      <button
                        key={idx}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        className={optionClass(attempt, idx)}
                        disabled={answered || reviewMode}
                        onClick={() => handleAnswer(q, idx)}
                      >
                        <span className="option-indicator" aria-hidden>
                          {answered && isCorrect ? (
                            <Check size={16} strokeWidth={2.5} />
                          ) : answered && isSelected && !isCorrect ? (
                            <X size={16} strokeWidth={2.5} />
                          ) : (
                            <Circle size={16} strokeWidth={2} />
                          )}
                        </span>
                        <span className="option-label">{opt.option}</span>
                      </button>
                    );
                  })}
                </div>

                {answered && (
                  <div className="pq-explain">
                    <button
                      type="button"
                      className={`pq-explain-btn ${
                        showExp[q._id] ? "open" : ""
                      }`}
                      onClick={() =>
                        setShowExp((prev) => ({
                          ...prev,
                          [q._id]: !prev[q._id],
                        }))
                      }
                    >
                      {showExp[q._id] ? "Hide explanation" : "Show explanation"}
                    </button>
                    {showExp[q._id] && (
                      <div className="pq-explain-body">
                        <p>{explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </main>

        {/* Right: subcategory dashboard */}
        <aside className="pq-sidebar">
          <div className="pq-side-card">
            <p className="pq-side-eyebrow">Topic progress</p>
            <h2>{topicLabel}</h2>
            <p className="pq-side-sub">
              Live stats for this subcategory
            </p>

            <div className="pq-side-ring" aria-hidden>
              <svg viewBox="0 0 36 36">
                <path
                  className="pq-ring-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="pq-ring-fg"
                  strokeDasharray={`${topicStats.accuracy}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="pq-ring-label">
                <strong>{topicStats.accuracy}%</strong>
                <span>Accuracy</span>
              </div>
            </div>

            <ul className="pq-side-stats">
              <li>
                <span className="pq-side-icon">
                  <Target size={16} />
                </span>
                <div>
                  <strong>{topicStats.total}</strong>
                  <span>Total questions</span>
                </div>
              </li>
              <li>
                <span className="pq-side-icon ok">
                  <CheckCircle2 size={16} />
                </span>
                <div>
                  <strong>{topicStats.solved}</strong>
                  <span>Solved (correct)</span>
                </div>
              </li>
              <li>
                <span className="pq-side-icon">
                  <CircleDashed size={16} />
                </span>
                <div>
                  <strong>{topicStats.attempted}</strong>
                  <span>Attempted</span>
                </div>
              </li>
              <li>
                <span className="pq-side-icon warn">
                  <Percent size={16} />
                </span>
                <div>
                  <strong>{topicStats.remaining}</strong>
                  <span>Remaining</span>
                </div>
              </li>
            </ul>

            <div className="pq-side-bar">
              <div className="pq-side-bar-top">
                <span>Completion</span>
                <strong>
                  {topicStats.total === 0
                    ? 0
                    : Math.round(
                        (topicStats.attempted / topicStats.total) * 100
                      )}
                  %
                </strong>
              </div>
              <div className="pq-side-track">
                <span
                  style={{
                    width: `${
                      topicStats.total === 0
                        ? 0
                        : Math.min(
                            100,
                            Math.round(
                              (topicStats.attempted / topicStats.total) * 100
                            )
                          )
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
