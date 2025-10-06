import React, { useState } from "react";
import { loginUser } from "../../services/api";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    const payload = { email, password };

    loginUser(payload)
      .then((res) => {
        localStorage.setItem("token", JSON.stringify(res.data.token));
        localStorage.setItem("user", JSON.stringify(res.data.user));
        alert("Login Successful");
        setEmail("");
        setPassword("");
        window.location.href = "/";
      })
      .catch((err) => {
        alert("Login Failed");
        console.error("Login Failed", err);
      });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Login</h1>

        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="login-input"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="login-input"
        />

        <button onClick={handleSubmit} className="login-button">
          Login
        </button>

        <p className="login-footer">
          Don’t have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
