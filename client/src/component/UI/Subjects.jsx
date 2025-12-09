import React, { useState } from "react";
import "./subjects.css";
import { useNavigate } from "react-router-dom";

function Subjects() {
  const navigate = useNavigate();
  const [activeSubject, setActiveSubject] = useState(null);

  const subjects = [
    {
      id: "aptitude",
      icon: "📊",
      title: "Aptitude",
      level: "Foundational",
      desc: "Build strong quantitative problem-solving skills",
      topics: [
        "Number System",
        "Percentages",
        "Ratio & Proportion",
        "Profit & Loss",
        "Time & Work",
        "Simple & Compound Interest",
        "Averages",
      ],
    },
    {
      id: "reasoning",
      icon: "🧠",
      title: "Reasoning",
      level: "Core Logic",
      desc: "Develop analytical and logical thinking",
      topics: [
        "Series Completion",
        "Analogies",
        "Coding & Decoding",
        "Direction Sense",
        "Blood Relations",
        "Seating Arrangements",
      ],
    },
    {
      id: "english",
      icon: "📘",
      title: "English",
      level: "Language Skills",
      desc: "Improve grammar, comprehension, and vocabulary",
      topics: [
        "Vocabulary Building",
        "Error Detection",
        "Sentence Improvement",
        "Synonyms & Antonyms",
        "Reading Comprehension",
      ],
    },
  ];

  const startPractice = () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    navigate(`/practice?category=${activeSubject.id}`);
  };

  return (
    <div className="roadmap-page">
      {/* HEADER */}
      <header className="roadmap-hero">
        <h1>Career Roadmap</h1>
        <p>Follow a structured learning path designed by experts</p>
      </header>

      {/* SUBJECT CARDS */}
      <section className="roadmap-grid">
        {subjects.map((sub) => (
          <div
            key={sub.id}
            className="roadmap-card"
            onClick={() => setActiveSubject(sub)}
          >
            <div className="card-icon">{sub.icon}</div>
            <h3>{sub.title}</h3>
            <span className="card-level">{sub.level}</span>
            <p>{sub.desc}</p>
            <div className="card-cta">View Roadmap →</div>
          </div>
        ))}
      </section>

      {/* MODAL */}
      {activeSubject && (
        <div className="modal-overlay" onClick={() => setActiveSubject(null)}>
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <span className="modal-icon">{activeSubject.icon}</span>
              <h2>{activeSubject.title} Roadmap</h2>
            </div>

            <p className="modal-desc">
              Start from basics and progress towards mastery
            </p>

            {/* ROADMAP STEPS */}
            <div className="timeline">
              {activeSubject.topics.map((topic, index) => (
                <div
                  className="timeline-step"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  key={index}
                >
                  <div className="step-number">{index + 1}</div>
                  <div className="step-content">{topic}</div>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setActiveSubject(null)}
              >
                Close
              </button>
              <button className="btn-primary" onClick={startPractice}>
                Start Learning Path →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subjects;
