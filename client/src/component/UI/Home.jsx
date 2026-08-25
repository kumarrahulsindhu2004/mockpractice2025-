import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  BookOpen,
  Zap,
  LineChart,
  Brain,
  BarChart3,
  Layers,
} from "lucide-react";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const handleStartPracticing = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/practice");
    } else {
      toast.error("Please log in to start practicing");
      navigate("/login");
    }
  };

  const handleViewSubjects = () => {
    navigate("/subject");
  };

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-content">
          <p className="hero-eyebrow">MockP Practice Platform</p>
          <h1 className="hero-title">
            Master your <span className="highlight">mock tests</span>
          </h1>
          <p className="hero-description">
            Focused MCQ practice for aptitude, reasoning, and English.
            Instant feedback, topic filters, and a progress dashboard.
          </p>
          <div className="hero-buttons">
            <button className="btn-start" onClick={handleStartPracticing}>
              Start practicing
            </button>
            <button className="btn-secondary" onClick={handleViewSubjects}>
              View subjects
            </button>
          </div>

          <ul className="hero-stats" aria-label="Platform highlights">
            <li>
              <BookOpen size={18} strokeWidth={2} aria-hidden />
              <div>
                <strong>1K+</strong>
                <span>Questions</span>
              </div>
            </li>
            <li>
              <Zap size={18} strokeWidth={2} aria-hidden />
              <div>
                <strong>Instant</strong>
                <span>Results</span>
              </div>
            </li>
            <li>
              <LineChart size={18} strokeWidth={2} aria-hidden />
              <div>
                <strong>Smart</strong>
                <span>Analytics</span>
              </div>
            </li>
          </ul>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-panel">
            <div className="hero-panel-top">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
            <div className="hero-stat-row">
              <div>
                <small>Accuracy</small>
                <strong>92%</strong>
              </div>
              <div>
                <small>Solved</small>
                <strong>128</strong>
              </div>
            </div>
            <div className="hero-progress">
              <div className="hero-progress-bar" />
            </div>
            <p className="hero-panel-caption">Your weekly practice snapshot</p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Built for placement prep</h2>
          <p className="section-description">
            Focused practice that feels clean, fast, and exam-ready
          </p>
        </div>

        <div className="feature-rows">
          <article className="feature-row">
            <div className="feature-media">
              <Brain size={36} strokeWidth={1.75} />
            </div>
            <div className="feature-copy">
              <h3>Core subjects</h3>
              <p>
                Aptitude, reasoning, and English — structured by topic so you
                practice what companies actually test.
              </p>
            </div>
          </article>

          <article className="feature-row feature-row--reverse">
            <div className="feature-media">
              <BarChart3 size={36} strokeWidth={1.75} />
            </div>
            <div className="feature-copy">
              <h3>Instant feedback</h3>
              <p>
                See correctness right away, review explanations, and spot weak
                areas before the real exam.
              </p>
            </div>
          </article>

          <article className="feature-row">
            <div className="feature-media">
              <Layers size={36} strokeWidth={1.75} />
            </div>
            <div className="feature-copy">
              <h3>Progress tracking</h3>
              <p>
                Dashboard stats for attempts, accuracy, and recent practice —
                so you know you are improving.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready when you are</h2>
          <p className="cta-description">
            Create an account and start a focused practice session in minutes.
          </p>
          <button className="btn-start large" onClick={handleStartPracticing}>
            Get started
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
