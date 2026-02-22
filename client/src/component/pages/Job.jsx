import React from "react";
import { motion } from "framer-motion";

const jobs = [
  {
    title: "Frontend Developer",
    tech: "React",
    level: "Freshers",
  },
  {
    title: "Backend Developer",
    tech: "Node.js",
    level: "Entry Level",
  },
  {
    title: "QA Tester",
    tech: "Manual + Automation",
    level: "Junior",
  },
  {
    title: "Full Stack Developer",
    tech: "MERN Stack",
    level: "0-1 Year",
  },
];

function Job() {
  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>💼 Career Opportunities</h1>

      <div style={gridStyle}>
        {jobs.map((job, index) => (
          <motion.div
            key={index}
            style={cardStyle}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h3>{job.title}</h3>
            <p>{job.tech}</p>
            <span style={badgeStyle}>{job.level}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const pageStyle = {
  padding: "60px 10%",
  background: "#f9fafb",
  minHeight: "100vh",
};

const headingStyle = {
  textAlign: "center",
  marginBottom: "40px",
  fontSize: "32px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "25px",
};

const cardStyle = {
  background: "#ffffff",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  cursor: "pointer",
  transition: "0.3s",
};

const badgeStyle = {
  display: "inline-block",
  marginTop: "10px",
  padding: "5px 10px",
  background: "#16a34a",
  color: "#fff",
  borderRadius: "20px",
  fontSize: "12px",
};

export default Job;