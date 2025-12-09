import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./practice.css";

// const categories = [
//   { name: "aptitude", display: "Aptitude" },
//   { name: "reasoning", display: "Reasoning" },
//   { name: "english", display: "English" },
//   { name: "computer", display: "Computer" },
//   { name: "communication", display: "Communication" },
// ];


const categories = [
  {
    name: "aptitude",
    title: "Aptitude",
    subtitle: "Quantitative problem solving",
    icon: "📊",
  },
  {
    name: "reasoning",
    title: "Reasoning",
    subtitle: "Logical & analytical thinking",
    icon: "🧠",
  },
  {
    name: "english",
    title: "English",
    subtitle: "Grammar & comprehension",
    icon: "📘",
  },
  {
    name: "computer",
    title: "Computer",
    subtitle: "CS fundamentals",
    icon: "💻",
  },
  {
    name: "communication",
    title: "Communication",
    subtitle: "Speaking & soft skills",
    icon: "🎤",
  },
];

function Practice() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState({});
  const [motivationalQuote, setMotivationalQuote] = useState("");

  // ✨ Motivational quotes
  const quotes = [
    "Practice makes progress, not perfection. 🚀",
    "Every question you solve brings you one step closer to success. 💪",
    "Learning never exhausts the mind. 🌟",
    "Small steps every day lead to big achievements. 🎯",
    "Your only limit is your effort. Keep going! 🔥",
  ];

  // ✅ Check login
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      alert("You need to login first!");
      navigate("/login");
    }
  }, [navigate]);

  // 🎯 Show random quote on page load
  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setMotivationalQuote(randomQuote);
  }, []);

  // ✅ Fetch subcategories
  const fetchSubcategories = async (category) => {
    setLoading(true);
    try {
      const res = await API.get(`/question/subcategory?category=${category}`);
      setSubcategories(res.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      alert("Failed to fetch subcategories");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch questions
  const fetchQuestions = async (category, subcategory) => {
    setLoading(true);
    try {
      const res = await API.get(
        `/question?category=${category}&sub_category=${subcategory}`
      );
      setQuestions(res.data);
      setShowExplanation({});
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchSubcategories(category);
  };

  const handleSubCategoryClick = (subcat) => {
    setSelectedSubCategory(subcat);
    fetchQuestions(selectedCategory, subcat);
  };

  const handleBack = () => {
    if (selectedSubCategory) {
      setSelectedSubCategory("");
      setQuestions([]);
    } else if (selectedCategory) {
      setSelectedCategory("");
      setSubcategories([]);
    }
  };

  const toggleExplanation = (id) => {
    setShowExplanation((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

return (
  <div className="practice-roadmap-page">

    {/* HERO (Same as Subject page) */}
    <header className="practice-hero">
      <h1>Practice Hub</h1>
      <p>Choose a skill and start practicing step by step</p>
    </header>

    {/* BACK BUTTON */}
    {(selectedCategory || selectedSubCategory) && (
      <div className="practice-back">
        <button className="back-btn" onClick={handleBack}>
          ← Back
        </button>
      </div>
    )}

    {/* CATEGORY VIEW */}
    {!selectedCategory && (
      <section className="practice-grid">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="practice-card"
            onClick={() => handleCategoryClick(cat.name)}
          >
            <div className="card-icon">{cat.icon}</div>
            <h3>{cat.title}</h3>
            <p>{cat.subtitle}</p>
            <div className="card-cta">Start Practice →</div>
          </div>
        ))}
      </section>
    )}

    {/* SUBCATEGORY VIEW */}
    {selectedCategory && !selectedSubCategory && (
      <section className="practice-grid">
        {loading ? (
          <p>Loading…</p>
        ) : (
          subcategories.map((sub) => (
            <div
              key={sub.name}
              className="practice-card small"
              onClick={() => handleSubCategoryClick(sub.name)}
            >
              <h3>{sub.display_name}</h3>
              <div className="card-cta">View Questions →</div>
            </div>
          ))
        )}
      </section>
    )}

    {/* QUESTIONS VIEW */}
    {selectedSubCategory && (
      <section className="questions-section">
        <h2 className="category-title">
          {selectedSubCategory.toUpperCase()} — Practice
        </h2>

        {loading && <p>Loading questions…</p>}

        {!loading && questions.map((q, i) => (
          <div key={q._id} className="question-card">
            <h3>Q{i + 1}. {q.question_text}</h3>
            <ul>
              {q.options.map((opt, idx) => (
                <li key={idx}>{opt.option}</li>
              ))}
            </ul>

            {q.explanation && (
              <>
                <button
                  className="explanation-btn"
                  onClick={() => toggleExplanation(q._id)}
                >
                  {showExplanation[q._id] ? "Hide Explanation" : "Show Explanation"}
                </button>

                {showExplanation[q._id] && (
                  <p className="explanation">{q.explanation}</p>
                )}
              </>
            )}
          </div>
        ))}
      </section>
    )}
  </div>
);

}

export default Practice;
