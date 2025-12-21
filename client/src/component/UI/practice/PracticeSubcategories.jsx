import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../../services/api";
import "./PracticeSubcategories.css";

export default function PracticeSubcategories() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    API.get(`/question/subcategory?category=${category}`)
      .then(res => setSubs(res.data));
  }, [category]);

  return (
    <>
      

      <div className="subcategory-grid">
        {subs.map(sub => (
          <div
            key={sub.name}
            className="subcategory-card"
            onClick={() => navigate(`/practice/${category}/${sub.name}`)}
          >
            <h3>{sub.display_name}</h3>
            <span className="view-btn">View Questions →</span>
          </div>
        ))}
      </div>
    </>
  );
}
