import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../../services/api";
import "./PracticeQuestions.css";

export default function PracticeQuestions() {
  const { category, subcategory } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [attempted, setAttempted] = useState({});
  const [showExp, setShowExp] = useState({});

  useEffect(() => {
    API.get(`/question?category=${category}&sub_category=${subcategory}`)
      .then(res => setQuestions(res.data));
  }, [category, subcategory]);

  const handleAnswer = (qId, idx) => {
    if (attempted[qId] !== undefined) return;
    setAttempted(prev => ({ ...prev, [qId]: idx }));
  };

  return (
    <>
      <button className="back-btn" onClick={() => navigate(`/practice/${category}`)}>
        ← Back
      </button>

      <h2 className="title">{subcategory.replace("_", " ").toUpperCase()}</h2>

      {questions.map((q, i) => {
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
                    onClick={() => handleAnswer(q._id, idx)}
                    disabled={selected !== undefined}
                  >
                    {opt.option}
                  </button>
                );
              })}
            </div>

            {selected !== undefined && q.explanation && (
              <>
                <button
                  className="explain-btn"
                  onClick={() =>
                    setShowExp(p => ({ ...p, [q._id]: !p[q._id] }))
                  }
                >
                  {showExp[q._id] ? "Hide Explanation" : "Show Explanation"}
                </button>

                {showExp[q._id] && (
                  <div className="explanation">{q.explanation}</div>
                )}
              </>
            )}
          </div>
        );
      })}
    </>
  );
}
