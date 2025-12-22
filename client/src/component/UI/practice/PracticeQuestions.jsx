import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../../services/api";
import "./PracticeQuestions.css";

export default function PracticeQuestions() {
  const { category, subcategory } = useParams();

  const [questions, setQuestions] = useState([]);
  const [attempted, setAttempted] = useState({});
  const [showExp, setShowExp] = useState({});
  const [justAnsweredIds, setJustAnsweredIds] = useState(new Set());
  const [solvedIds, setSolvedIds] = useState(new Set());

  const [filters, setFilters] = useState({
    status: { solved: false, unsolved: true },
    difficulty: [],
    exams: [],
  });

  // ✅ Mobile filter state
  const [openFilter, setOpenFilter] = useState(null);
  const isMobile = window.innerWidth <= 768;

  /* ---------------- FETCH SOLVED ---------------- */
  useEffect(() => {
    API.get("/progress/solved")
      .then(res => setSolvedIds(new Set(res.data)))
      .catch(console.error);
  }, []);

  /* ---------------- FETCH ATTEMPTS ---------------- */
  useEffect(() => {
    API.get("/progress/my").then(res => {
      const map = {};
      res.data.forEach(p => {
        map[p.question] = p.selectedOptionIndex;
      });
      setAttempted(map);
    });
  }, []);

  /* ---------------- FETCH QUESTIONS ---------------- */
  useEffect(() => {
    const params = new URLSearchParams();
    params.append("category", category);
    params.append("sub_category", subcategory);

    if (filters.difficulty.length) {
      params.append("difficulty", filters.difficulty.join(","));
    }
    if (filters.exams.length) {
      params.append("tags", filters.exams.join(","));
    }

    API.get(`/question?${params.toString()}`)
      .then(res => setQuestions(res.data));
  }, [category, subcategory, filters]);

  /* ---------------- HANDLERS ---------------- */
  const handleAnswer = async (q, selectedIdx) => {
    if (attempted[q._id] !== undefined) return;

    setAttempted(prev => ({ ...prev, [q._id]: selectedIdx }));
    setJustAnsweredIds(prev => new Set(prev).add(q._id));

    const correctIndex = q.options.findIndex(o => o.is_correct);
    const isCorrect = selectedIdx === correctIndex;

    try {
      await API.post("/progress", {
        questionId: q._id,
        selectedOptionIndex: selectedIdx,
        isCorrect,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const toggleMulti = (group, value) => {
    setFilters(prev => ({
      ...prev,
      [group]: prev[group].includes(value)
        ? prev[group].filter(v => v !== value)
        : [...prev[group], value],
    }));
  };

  const handleStatusChange = type => {
    setFilters(prev => ({
      ...prev,
      status: {
        solved: type === "solved",
        unsolved: type === "unsolved",
      },
    }));
  };

  /* ---------------- FILTERED QUESTIONS ---------------- */
  const filteredQuestions = questions.filter(q => {
    const solvedInDB = solvedIds.has(q._id);
    const justSolvedNow = justAnsweredIds.has(q._id);
    const effectiveSolved = solvedInDB && !justSolvedNow;

    if (filters.status.solved && !effectiveSolved) return false;
    if (filters.status.unsolved && effectiveSolved) return false;

    return true;
  });

  return (
    <div className="practice-wrapper">

      {/* ================= DESKTOP FILTER ================= */}
      {!isMobile && (
        <aside className="filter-panel">
          <h4>Status</h4>
          <label>
            <input
              type="checkbox"
              checked={filters.status.unsolved}
              onChange={() => handleStatusChange("unsolved")}
            />
            Unsolved
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.status.solved}
              onChange={() => handleStatusChange("solved")}
            />
            Solved
          </label>

          <h4>Difficulty</h4>
          {["easy", "medium", "hard"].map(d => (
            <label key={d}>
              <input
                type="checkbox"
                onChange={() => toggleMulti("difficulty", d)}
              />
              {d.toUpperCase()}
            </label>
          ))}

          <h4>Target Exam</h4>
          {["tcs", "wipro", "rrb"].map(exam => (
            <label key={exam}>
              <input
                type="checkbox"
                onChange={() => toggleMulti("exams", exam)}
              />
              {exam.toUpperCase()}
            </label>
          ))}
        </aside>
      )}

      {/* ================= MOBILE FILTER BAR ================= */}
      {isMobile && (
        <div className="mobile-filter-bar">
          <button onClick={() => setOpenFilter("status")}>Status ▾</button>
          <button onClick={() => setOpenFilter("difficulty")}>Difficulty ▾</button>
          <button onClick={() => setOpenFilter("exam")}>Target Exam ▾</button>
        </div>
      )}

      {/* ================= MOBILE SHEETS ================= */}
      {openFilter === "status" && (
        <div className="mobile-filter-sheet">
          <h4>Status</h4>
          <label>
            <input
              type="radio"
              checked={filters.status.unsolved}
              onChange={() => handleStatusChange("unsolved")}
            />
            Unsolved
          </label>
          <label>
            <input
              type="radio"
              checked={filters.status.solved}
              onChange={() => handleStatusChange("solved")}
            />
            Solved
          </label>
          <button onClick={() => setOpenFilter(null)}>Apply</button>
        </div>
      )}

      {openFilter === "difficulty" && (
        <div className="mobile-filter-sheet">
          <h4>Difficulty</h4>
          {["easy", "medium", "hard"].map(d => (
            <label key={d}>
              <input
                type="checkbox"
                checked={filters.difficulty.includes(d)}
                onChange={() => toggleMulti("difficulty", d)}
              />
              {d.toUpperCase()}
            </label>
          ))}
          <button onClick={() => setOpenFilter(null)}>Apply</button>
        </div>
      )}

      {openFilter === "exam" && (
        <div className="mobile-filter-sheet">
          <h4>Target Exam</h4>
          {["tcs", "wipro", "rrb"].map(exam => (
            <label key={exam}>
              <input
                type="checkbox"
                checked={filters.exams.includes(exam)}
                onChange={() => toggleMulti("exams", exam)}
              />
              {exam.toUpperCase()}
            </label>
          ))}
          <button onClick={() => setOpenFilter(null)}>Apply</button>
        </div>
      )}

      {/* ================= QUESTIONS ================= */}
      <main className="questions-area">
        <h2 className="title">
          {subcategory.replace("_", " ").toUpperCase()}
        </h2>

        {filteredQuestions.map((q, i) => {
          const selected = attempted[q._id];
          return (
            <div key={q._id} className="question-card">
              <h3>Q{i + 1}</h3>
              <p>{q.question_text}</p>

              <div className="options">
                {q.options.map((opt, idx) => {
                  let cls = "option";
                  if (selected !== undefined) {
                    if (opt.is_correct) cls += " correct";
                    else if (selected === idx) cls += " wrong";
                    else cls += " disabled";
                  }
                  return (
                    <button
                      key={idx}
                      className={cls}
                      disabled={selected !== undefined}
                      onClick={() => handleAnswer(q, idx)}
                    >
                      {opt.option}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
