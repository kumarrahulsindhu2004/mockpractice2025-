import React from 'react'
import { useNavigate } from "react-router-dom"
import "./Home.css"
function Home() {
  const navigate = useNavigate()
  // const { isLoggedIn } = useAuth()

  const handleStartPracticing = () => {
    navigate("/practice")

    // const token = localStorage.getItem("token");
    //  if (token) {
    //   // ✅ user is logged in → go to practice page
    //   navigate("/practice");
    // } else {
    //   // 🚫 not logged in → show alert and go to login page
    //   alert("You must be logged in to start practicing!");
    //   navigate("/login");
    // }
  }

  const handleViewSubjects = () => {
    if (isLoggedIn) {
      navigate("/practice")
    } else {
      navigate("/login")
    }
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Master Your <span className="highlight">Mock Tests</span>
          </h1>
          <p className="hero-description">
            Prepare for competitive exams with our comprehensive practice platform. Get instant feedback, track your
            progress, and boost your confidence.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleStartPracticing}>
              Start Practicing
            </button>
            <button className="btn-secondary" onClick={handleViewSubjects}>
              View Subjects
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card card-1">
            <div className="card-icon">📚</div>
            <span>1000+ Questions</span>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">⚡</div>
            <span>Instant Results</span>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">🎯</div>
            <span>Smart Analytics</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose Our Platform?</h2>
          <p className="section-description">Everything you need to excel in your competitive exams</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3 className="feature-title">Diverse Subjects</h3>
            <p className="feature-description">
              Practice across multiple domains including Mathematics, Reasoning, General Knowledge, and Aptitude with
              expertly crafted questions.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Real-time Feedback</h3>
            <p className="feature-description">
              Get instant results with detailed explanations and performance analytics to identify your strengths and
              areas for improvement.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚙️</div>
            <h3 className="feature-title">Customizable Tests</h3>
            <p className="feature-description">
              Create personalized practice sessions with adjustable difficulty levels, time limits, and question types
              to match your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Students</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">5K+</div>
            <div className="stat-label">Questions</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">15+</div>
            <div className="stat-label">Subjects</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">95%</div>
            <div className="stat-label">Success Rate</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Your Journey?</h2>
          <p className="cta-description">
            Join thousands of students who have improved their exam scores with our platform
          </p>
          <button className="btn-primary large" onClick={handleStartPracticing}>
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home