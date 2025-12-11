import React, { useState } from "react";
import { loginUser } from "../../services/api";
import "./login.css";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // 🔍 Validate input fields
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    const payload = { email, password };

    try {
      const res = await loginUser(payload);
      localStorage.setItem("token", JSON.stringify(res.data.token));
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Login Successful");
      setEmail("");
      setPassword("");
      window.location.href = "/";
    } catch (err) {
      alert("Login Failed");
      console.error("Login Failed", err);
    } finally {
      setLoading(false);
    }
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
        {errors.email && <p className="error-text">{errors.email}</p>}

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="login-input"
        />
        {errors.password && <p className="error-text">{errors.password}</p>}

        <button
          onClick={handleSubmit}
          className="login-button"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {loading && <div className="loader"></div>}

        <p className="login-footer">
          Don’t have an account? <Link to ="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
