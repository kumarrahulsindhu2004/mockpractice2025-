import React, { useState } from "react";
import { loginUser } from "../../services/api";
import { Link } from "react-router-dom";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email))
      newErrors.email = "Enter a valid email address";

    if (!password || password.length < 6)
      newErrors.password = "Minimum 6 characters required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      localStorage.setItem("token", JSON.stringify(res.data.token));
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Login Successful");
      window.location.href = "/";
    } catch (err) {
      alert("Invalid credentials — please try again");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card glass">
        <h1 className="login-title">Welcome Back 👋</h1>
        <p className="login-subtitle">Continue your learning journey</p>

        <div className={`input-wrapper ${errors.email ? "error" : ""}`}>
          <input
            type="text"
            value={email}
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        {errors.email && <p className="error-text">{errors.email}</p>}

        <div className={`input-wrapper ${errors.password ? "error" : ""}`}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>
        {errors.password && <p className="error-text">{errors.password}</p>}

        <button
          className="login-button rich"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        {loading && <div className="loader" />}

        <p className="login-footer">
          Don’t have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
