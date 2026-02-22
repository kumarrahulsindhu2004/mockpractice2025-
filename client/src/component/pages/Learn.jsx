import React from "react";
import { motion } from "framer-motion";

const courses = [
  { title: "Aptitude Mastery", level: "Beginner" },
  { title: "Logical Reasoning", level: "Intermediate" },
  { title: "English Grammar", level: "Beginner" },
  { title: "Coding Basics", level: "Advanced" },
];

function Learn() {
  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>📚 Learn with MockP</h1>

      <div style={gridStyle}>
        {courses.map((course, index) => (
          <motion.div
            key={index}
            style={cardStyle}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h3>{course.title}</h3>
            <span style={badgeStyle}>{course.level}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const pageStyle = {
  padding: "60px 10%",
  background: "#ffffff",
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
  background: "#f3f4f6",
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
  background: "#2563eb",
  color: "#fff",
  borderRadius: "20px",
  fontSize: "12px",
};

export default Learn;