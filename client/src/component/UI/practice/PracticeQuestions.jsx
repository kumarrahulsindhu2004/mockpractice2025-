// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import API from "../../../services/api";
// import "./PracticeQuestions.css";

// export default function PracticeQuestions() {
//   const { category, subcategory } = useParams();
//   const navigate = useNavigate();

//   const [questions, setQuestions] = useState([]);
//   const [attempted, setAttempted] = useState({});
//   const [showExp, setShowExp] = useState({});

//   useEffect(() => {
//     API.get(`/question?category=${category}&sub_category=${subcategory}`)
//       .then(res => setQuestions(res.data));
//   }, [category, subcategory]);

//   const handleAnswer = (qId, idx) => {
//     if (attempted[qId] !== undefined) return;
//     setAttempted(prev => ({ ...prev, [qId]: idx }));
//   };
//   const [filters, setFilters] = useState({
//   status: {
//     solved: false,
//     unsolved: false,
//   },
//   difficulty: [],
//   exams: [],
// });
// const toggleFilter = (group, value) => {
//   setFilters(prev => {
//     const list = prev[group];
//     return {
//       ...prev,
//       [group]: list.includes(value)
//         ? list.filter(v => v !== value)
//         : [...list, value],
//     };
//   });
// };


//   return (
//     <>
//       {/* <button className="back-btn" onClick={() => navigate(`/practice/${category}`)}>
//         ← Back
//       </button> */}

//       <h2 className="title">{subcategory.replace("_", " ").toUpperCase()}</h2>

//       {questions.map((q, i) => {
//         const selected = attempted[q._id];

//         return (
//           <div key={q._id} className="question-card">
//             <h3>Q{i + 1}</h3>
//             <p>{q.question_text}</p>

//             <div className="options">
//               {q.options.map((opt, idx) => {
//                 let cls = "option";
//                 if (selected !== undefined) {
//                   if (opt.is_correct) cls += " correct";
//                   else if (selected === idx) cls += " wrong";
//                   else cls += " disabled";
//                 }

//                 return (
//                   <button
//                     key={idx}
//                     className={cls}
//                     onClick={() => handleAnswer(q._id, idx)}
//                     disabled={selected !== undefined}
//                   >
//                     {opt.option}
//                   </button>
//                 );
//               })}
//             </div>

//             {/* {selected !== undefined && q.explanation && (
//               <>
//                 <button
//                   className="explain-btn"
//                   onClick={() =>
//                     setShowExp(p => ({ ...p, [q._id]: !p[q._id] }))
//                   }
//                 >
//                   {showExp[q._id] ? "Hide Explanation" : "Show Explanation"}
//                 </button>

//                 {showExp[q._id] && (
//                   <div className="explanation">{q.explanation}</div>
//                 )}
//               </>
//             )} */}

//             {selected !== undefined && q.explanation && (
//   <>
//     <button
//       className={`explanation-toggle ${
//         showExp[q._id] ? "open" : ""
//       }`}
//       onClick={() =>
//         setShowExp(prev => ({
//           ...prev,
//           [q._id]: !prev[q._id],
//         }))
//       }
//     >
//       {showExp[q._id] ? "Hide Explanation ▲" : "Show Explanation ▼"}
//     </button>

//     <div className={`explanation-box ${showExp[q._id] ? "show" : ""}`}>
//       <p>{q.explanation}</p>
//     </div>
//   </>
// )}



//             {/* Tags / Asked In */}
// {q.tags?.length > 0 && (
//   <div className="question-tags">
//     <span className="asked-label">Asked in:</span>
//     {q.tags.map((tag, idx) => (
//       <span key={idx} className="tag-badge">
//         {tag.toUpperCase()}
//       </span>
//     ))}
//   </div>
// )}

//           </div>
//         );
//       })}
//     </>
//   );
// }



import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../../services/api";
import "./PracticeQuestions.css";

export default function PracticeQuestions() {
  const { category, subcategory } = useParams();

  const [questions, setQuestions] = useState([]);
  const [attempted, setAttempted] = useState({});
  const [showExp, setShowExp] = useState({});

  const [filters, setFilters] = useState({
    status: { solved: false, unsolved: false },
    difficulty: [],
    exams: [],
  });

  /* ---------------- FETCH QUESTIONS ---------------- */
  useEffect(() => {
    const params = new URLSearchParams();

    params.append("category", category);
    params.append("sub_category", subcategory);

    if (filters.difficulty.length > 0) {
      params.append("difficulty", filters.difficulty.join(","));
    }

    if (filters.exams.length > 0) {
      params.append("tags", filters.exams.join(","));
    }

    API.get(`/question?${params.toString()}`)
      .then(res => setQuestions(res.data));
  }, [category, subcategory, filters]);

  /* ---------------- HELPERS ---------------- */
  const toggleMulti = (group, value) => {
    setFilters(prev => ({
      ...prev,
      [group]: prev[group].includes(value)
        ? prev[group].filter(v => v !== value)
        : [...prev[group], value],
    }));
  };

  const handleAnswer = (qId, idx) => {
    if (attempted[qId] !== undefined) return;
    setAttempted(prev => ({ ...prev, [qId]: idx }));
  };

  /* ---------------- STATUS FILTER (FRONTEND) ---------------- */
  const filteredQuestions = questions.filter(q => {
    const solved = attempted[q._id] !== undefined;

    if (filters.status.solved && !solved) return false;
    if (filters.status.unsolved && solved) return false;

    return true;
  });

  return (
    <div className="practice-wrapper">

      {/* ================= FILTER PANEL ================= */}
      <aside className="filter-panel">
        <h4>Status</h4>
        <label>
          <input
            type="checkbox"
            onChange={e =>
              setFilters(f => ({
                ...f,
                status: { ...f.status, solved: e.target.checked },
              }))
            }
          />
          Solved
        </label>

        <label>
          <input
            type="checkbox"
            onChange={e =>
              setFilters(f => ({
                ...f,
                status: { ...f.status, unsolved: e.target.checked },
              }))
            }
          />
          Unsolved
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
                      onClick={() => handleAnswer(q._id, idx)}
                    >
                      {opt.option}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {selected !== undefined && q.explanation && (
                <>
                  <button
                    className={`explanation-toggle ${
                      showExp[q._id] ? "open" : ""
                    }`}
                    onClick={() =>
                      setShowExp(prev => ({
                        ...prev,
                        [q._id]: !prev[q._id],
                      }))
                    }
                  >
                    {showExp[q._id]
                      ? "Hide Explanation ▲"
                      : "Show Explanation ▼"}
                  </button>

                  <div
                    className={`explanation-box ${
                      showExp[q._id] ? "show" : ""
                    }`}
                  >
                    <p>{q.explanation}</p>
                  </div>
                </>
              )}

              {/* Tags */}
              {q.tags?.length > 0 && (
                <div className="question-tags">
                  <span className="asked-label">Asked in:</span>
                  {q.tags.map((tag, idx) => (
                    <span key={idx} className="tag-badge">
                      {tag.toUpperCase()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}

