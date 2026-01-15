// import { useEffect, useState } from "react";
// import API from "../../services/api";
// import "./Dashboard.css";

// export default function Dashboard() {
//   const [user, setUser] = useState(null);
//   const [stats, setStats] = useState(null);
//   const [recent, setRecent] = useState([]);

//   useEffect(() => {
//     // Fetch user profile
//     API.get("/user/profile").then((res) => {
//       setUser(res.data.user);
//     });

//     // Fetch stats
//     API.get("/progress/stats").then((res) => {
//       setStats(res.data);
//     });

//     // Fetch recent practice
//     API.get("/progress/my").then((res) => {
//       setRecent(res.data.slice(0, 4));
//     });
//   }, []);

//   const logout = () => {
//     localStorage.clear();
//     window.location.href = "/login";
//   };

//   if (!user || !stats) return null;

//   return (
//     <div className="dashboard">
//       {/* HEADER */}
//       <h1>Welcome, {user.name} 👋</h1>

//       {/* STATS CARDS */}
//       <div className="dashboard-cards">
//         <div className="card">
//           <h3>Total Solved</h3>
//           <p>{stats.totalSolved}</p>
//         </div>

//         <div className="card">
//           <h3>Accuracy</h3>
//           <p>{stats.accuracy}%</p>
//         </div>

//         <div className="card">
//           <h3>Global Rank</h3>
//           <p>#{stats.rank}</p>
//         </div>

//         <div className="card">
//           <h3>Current Streak</h3>
//           <p>{stats.streak} Days</p>
//         </div>
//       </div>

//       {/* PROFILE SECTION */}
//       <div className="profile-section">
//         <h2>Your Profile</h2>

//         <div className="profile-grid">
//           <div className="profile-item">
//             <span>Name</span>
//             {user.name}
//           </div>

//           <div className="profile-item">
//             <span>Email</span>
//             {user.email}
//           </div>

//           <div className="profile-item">
//             <span>Total Attempted</span>
//             {stats.totalAttempted}
//           </div>

//           <div className="profile-item">
//             <span>Correct Answers</span>
//             {stats.totalSolved}
//           </div>
//         </div>
//       </div>

//       {/* RECENT PRACTICE */}
//       <div className="profile-section">
//         <h2>Recent Practice</h2>

//         {recent.length === 0 && <p>No recent activity</p>}

//         {recent.map((item, idx) => (
//           <div key={idx} className="profile-item">
//             <span>{item.isCorrect ? "Solved" : "Attempted"}</span>
//             Question ID: {item.question}
//           </div>
//         ))}
//       </div>

//       {/* LOGOUT */}
//       {/* <button className="logout-btn" onClick={logout}>
//         Logout
//       </button> */}
//     </div>
//   );
// }










import { useEffect, useState } from "react";
import API from "../../services/api";
import "./Dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    API.get("/user/profile").then(res => setUser(res.data.user));
    API.get("/progress/stats").then(res => setStats(res.data));
    API.get("/progress/my").then(res => setRecent(res.data.slice(0, 4)));
  }, []);


  // const logout = () => {
  //   localStorage.clear();
  //   window.location.href = "/login";
  // };

  if (!user || !stats) return null;

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Welcome, {user.name} 👋</h1>
        {/* <button className="logout-btn small" onClick={logout}>
          Logout
        </button> */}
      </div>

      {/* STATS */}
      <div className="dashboard-cards">
        <div className="card">
          <h3>Total Attempted</h3>
          <p>{stats.totalAttempted}</p>
        </div>

        <div className="card">
          <h3>Accuracy</h3>
          <p>{stats.accuracy}%</p>
        </div>

        <div className="card">
          <h3>Correct Answers</h3>
          <p>{stats.totalSolved}</p>
        </div>

        {/* <div className="card">
          <h3>Current Streak</h3>
          <p>{stats.streak} Days</p>
        </div> */}
      </div>

      {/* PROFILE */}
      <div className="profile-section">
        <h2>Your Profile</h2>

        <div className="profile-grid">
          <div className="profile-item">
            <span>Name</span>
            {user.name}
          </div>

          <div className="profile-item">
            <span>Email</span>
            {user.email}
          </div>

          <div className="profile-item">
            <span>Total Attempted</span>
            {stats.totalAttempted}
          </div>

          <div className="profile-item">
            <span>Correct Answers</span>
            {stats.totalSolved}
          </div>
        </div>
      </div>

      {/* RECENT PRACTICE */}
    {/* RECENT PRACTICE */}
<div className="profile-section">
  <h2>Recent Practice</h2>

  {recent.length === 0 && <p>No recent activity</p>}

  <div className="recent-list">
    {recent.map((item, idx) => (
      <div key={idx} className="recent-item">
        <div>
          <strong className="topic">
            {item.question?.sub_category
              ?.replace(/_/g, " ")
              .toUpperCase()}
          </strong>
          <div className="category">
            {item.question?.category?.toUpperCase()}
          </div>
        </div>

        <span
          className={`status ${
            item.isCorrect ? "solved" : "attempted"
          }`}
        >
          {item.isCorrect ? "SOLVED" : "ATTEMPTED"}
        </span>
      </div>
    ))}
  </div>
</div>

    </div>
  );
}
