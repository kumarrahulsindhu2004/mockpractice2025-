import React from "react";

function Contest() {
  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center"
    }}>
      <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
        🚀 Contest Section
      </h1>

      <p style={{ fontSize: "18px", color: "#6b7280" }}>
        Upcoming test series will be available soon.
      </p>

      <p style={{ fontSize: "14px", marginTop: "10px" }}>
        Stay tuned for exciting contests and paid test series.
      </p>
    </div>
  );
}

export default Contest;