import { createContext, useContext, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import API from "../../../services/api";
import "./PracticeLayout.css";

const PracticeHubContext = createContext({
  summary: null,
  progress: null,
  loading: true,
  refresh: () => {},
});

export function usePracticeHub() {
  return useContext(PracticeHubContext);
}

const PracticeLayout = () => {
  const location = useLocation();
  const [summary, setSummary] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const isHubHome = location.pathname === "/practice" || location.pathname === "/practice/";

  const load = async () => {
    setLoading(true);
    try {
      const [summaryRes, hubRes] = await Promise.all([
        API.get("/question/hub-summary"),
        API.get("/progress/hub").catch(() => ({ data: null })),
      ]);
      setSummary(summaryRes.data);
      setProgress(hubRes.data);
    } catch (err) {
      console.error(err);
      setSummary(null);
      setProgress(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const totals = summary?.totals || { questions: 0, topics: 0, categories: 0 };
  const userTotals = progress?.totals || {
    attempted: 0,
    correct: 0,
    accuracy: 0,
  };
  const remaining = Math.max(0, totals.questions - userTotals.attempted);

  return (
    <PracticeHubContext.Provider
      value={{ summary, progress, loading, refresh: load }}
    >
      <div className="practice-layout">
        {isHubHome && (
          <header className="practice-hero">
            <p className="practice-eyebrow">MockP Practice</p>
            <h1>Practice Hub</h1>
            <p className="practice-lead">
              Build placement readiness with aptitude, reasoning, and English —
              tracked against your live progress.
            </p>

            {!loading && summary && (
              <div className="hub-stats" aria-label="Live practice stats">
                <div className="hub-stat">
                  <strong>{totals.questions.toLocaleString()}</strong>
                  <span>Total questions</span>
                </div>
                <div className="hub-stat">
                  <strong>{totals.topics}</strong>
                  <span>Topics</span>
                </div>
                <div className="hub-stat">
                  <strong>{userTotals.attempted}</strong>
                  <span>Attempted</span>
                </div>
                <div className="hub-stat hub-stat--accent">
                  <strong>{remaining}</strong>
                  <span>Remaining</span>
                </div>
                <div className="hub-stat">
                  <strong>{userTotals.accuracy}%</strong>
                  <span>Accuracy</span>
                </div>
              </div>
            )}
          </header>
        )}

        <div className="practice-body">
          <Outlet />
        </div>
      </div>
    </PracticeHubContext.Provider>
  );
};

export default PracticeLayout;
