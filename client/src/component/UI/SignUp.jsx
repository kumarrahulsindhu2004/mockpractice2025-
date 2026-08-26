import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../services/api";
import toast from "react-hot-toast";
import "./signup.css";

const EDUCATION_OPTIONS = [
  { value: "", label: "I am a…" },
  { value: "student", label: "Student" },
  { value: "graduate", label: "Graduate" },
  { value: "working", label: "Working professional" },
];

function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    education_level: "",
    college_name: "",
    graduation_year: "",
    location: "",
    address: "",
    target_exam: "",
  });

  const isStudentOrGraduate =
    formData.education_level === "student" ||
    formData.education_level === "graduate";
  const needsGraduationYear = formData.education_level === "graduate";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signupUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        education_level: formData.education_level,
        college_name: formData.college_name.trim(),
        graduation_year: formData.graduation_year || undefined,
        location: formData.location.trim(),
        address: formData.address.trim(),
        target_exam: formData.target_exam.trim(),
      });
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
          <p>
            Practice smarter. Get exam-ready with curated questions and clear
            progress.
          </p>
          <ul>
            <li>
              <span>✓</span> Topic-wise practice
            </li>
            <li>
              <span>✓</span> Instant feedback
            </li>
            <li>
              <span>✓</span> Progress dashboard
            </li>
          </ul>
        </div>

        <div className="panel-right">
          <h2>Create your account</h2>
          <p className="subtitle">Tell us a bit about you so we can keep accounts genuine</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              required
              minLength={2}
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

            <select
              name="education_level"
              value={formData.education_level}
              onChange={handleChange}
              required
            >
              {EDUCATION_OPTIONS.map((opt) => (
                <option key={opt.value || "empty"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <div className="grid-two">
              <input
                type="text"
                name="college_name"
                placeholder={
                  isStudentOrGraduate
                    ? "College / university name"
                    : "College (optional)"
                }
                value={formData.college_name}
                onChange={handleChange}
                required={isStudentOrGraduate}
                minLength={isStudentOrGraduate ? 3 : undefined}
              />

              <input
                type="number"
                name="graduation_year"
                placeholder={
                  needsGraduationYear
                    ? "Graduation year"
                    : "Graduation year (optional)"
                }
                value={formData.graduation_year}
                onChange={handleChange}
                required={needsGraduationYear}
                min={1990}
                max={new Date().getFullYear() + 6}
              />
            </div>

            <input
              type="text"
              name="location"
              placeholder="City"
              value={formData.location}
              onChange={handleChange}
              required
              minLength={2}
            />

            <textarea
              name="address"
              placeholder="Full address"
              value={formData.address}
              onChange={handleChange}
              required
              minLength={8}
              rows={2}
            />

            <input
              type="text"
              name="target_exam"
              placeholder="Target exams (optional, e.g. TCS, Wipro)"
              value={formData.target_exam}
              onChange={handleChange}
            />

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
