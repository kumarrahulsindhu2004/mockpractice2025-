import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./practice.css";

const categories = [
  { name: "aptitude", display: "Aptitude" },
  { name: "reasoning", display: "Reasoning" },
  { name: "english", display: "English" },
  { name: "computer", display: "Computer" },
  { name: "communication", display: "Communication" },
];

function Practice() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState({}); // ✅ Track per-question toggle

  // ✅ Check login
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      alert("You need to login first!");
      navigate("/login");
    }
  }, [navigate]);

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
      setShowExplanation({}); // reset explanation visibility
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

  // ✅ Toggle explanation for each question
  const toggleExplanation = (id) => {
    setShowExplanation((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="practice-page">
      <h1 className="page-title">Practice Questions</h1>

      {(selectedCategory || selectedSubCategory) && (
        <button className="back-btn" onClick={handleBack}>
          ⬅ Back
        </button>
      )}

      {/* Category View */}
      {!selectedCategory && (
        <div className="category-grid">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="category-card"
              onClick={() => handleCategoryClick(cat.name)}
            >
              <h2>{cat.display}</h2>
            </div>
          ))}
        </div>
      )}

      {/* Subcategory View */}
      {selectedCategory && !selectedSubCategory && (
        <div className="subcategory-grid">
          {loading ? (
            <p>Loading subcategories...</p>
          ) : subcategories.length > 0 ? (
            subcategories.map((sub) => (
              <div
                key={sub.name}
                className="subcategory-card"
                onClick={() => handleSubCategoryClick(sub.name)}
              >
                <h3>{sub.display_name}</h3>
              </div>
            ))
          ) : (
            <p>No subcategories found.</p>
          )}
        </div>
      )}

      {/* Questions View */}
      {selectedSubCategory && (
        <div className="questions-section">
          <h2 className="category-title">
            {selectedSubCategory.charAt(0).toUpperCase() +
              selectedSubCategory.slice(1)}{" "}
            Questions
          </h2>

          {loading && <p>Loading questions...</p>}

          {!loading && questions.length > 0 && (
            <div className="questions-list">
              {questions.map((q, index) => (
                <div key={q._id} className="question-card">
                  <h3>
                    Q{index + 1}: {q.question_text}
                  </h3>
                  <ul>
                    {q.options.map((opt, i) => (
                      <li key={i}>{opt.option}</li>
                    ))}
                  </ul>

                  {q.explanation && (
                    <>
                      <button
                        className="explanation-btn"
                        onClick={() => toggleExplanation(q._id)}
                      >
                        {showExplanation[q._id]
                          ? "Hide Explanation"
                          : "Show Explanation"}
                      </button>

                      {showExplanation[q._id] && (
                        <p className="explanation">
                          <strong>Explanation:</strong> {q.explanation}
                        </p>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {!loading && questions.length === 0 && (
            <p>No questions found in this subcategory.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Practice;
