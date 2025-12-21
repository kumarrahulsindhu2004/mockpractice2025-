import { Outlet } from "react-router-dom";
import "./PracticeLayout.css";

const PracticeLayout = () => {
  return (
    <div className="practice-layout">
      <header className="practice-hero">
        <h1>Practice Hub</h1>
        <p>Choose a skill and start practicing step by step</p>
      </header>

      <Outlet />
    </div>
  );
};

export default PracticeLayout;
