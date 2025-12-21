import { useNavigate } from "react-router-dom";
import "./PracticeCategories.css";

const categories = [
  { name: "aptitude", title: "Aptitude", subtitle: "Quantitative problem solving", icon: "📊" },
  { name: "reasoning", title: "Reasoning", subtitle: "Logical thinking", icon: "🧠" },
  { name: "english", title: "English", subtitle: "Grammar & comprehension", icon: "📘" },
  { name: "computer", title: "Computer", subtitle: "CS fundamentals", icon: "💻" },
  { name: "communication", title: "Communication", subtitle: "Speaking skills", icon: "🗣️" },
];

export default function PracticeCategories() {
  const navigate = useNavigate();

  return (
    <section className="category-grid">
      {categories.map(cat => (
        <div
          key={cat.name}
          className="category-card"
          onClick={() => navigate(`/practice/${cat.name}`)}
        >
          <div className="icon">{cat.icon}</div>
          <h3>{cat.title}</h3>
          <p>{cat.subtitle}</p>
          <span>Start Practice →</span>
        </div>
      ))}
    </section>
  );
}
