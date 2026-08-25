import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../services/api";
import toast from "react-hot-toast";
import "./signup.css";

function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    education_level: "",
    target_exam: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signupUser(formData);
      localStorage.setItem("otpEmail", formData.email);
      toast.success("Account created. Check your email for OTP.");
      navigate("/verify-otp");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-shell">
      <div className="signup-container">
        <div className="panel-left">
          <div className="logo-box">P</div>
          <h1>MockP</h1>
          <p>Practice smarter. Get exam-ready with curated questions and clear progress.</p>
          <ul>
            <li><span>✓</span> Topic-wise practice</li>
            <li><span>✓</span> Instant feedback</li>
            <li><span>✓</span> Progress dashboard</li>
          </ul>
        </div>

        <div className="panel-right">
          <h2>Create your account</h2>
          <p className="subtitle">Start practicing in a few minutes</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />

            <div className="grid-two">
              <input
                type="text"
                name="education_level"
                placeholder="Education"
                value={formData.education_level}
                onChange={handleChange}
              />

              <input
                type="text"
                name="target_exam"
                placeholder="Target exams"
                value={formData.target_exam}
                onChange={handleChange}
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <p className="login-text">
            Already have an account?
            <span onClick={() => navigate("/login")}> Log in</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
