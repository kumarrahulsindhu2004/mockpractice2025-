import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../services/api";
import "./signup.css";

function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    mobile: "",
    address: "",
    password: "",
    education_level: "",
    target_exam: "",
    college_name: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Validation logic
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const strongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!emailRegex.test(formData.email))
      newErrors.email = "Please enter a valid email address.";
    if (!phoneRegex.test(formData.mobile))
      newErrors.mobile = "Please enter a valid 10-digit mobile number.";
    if (!strongPassword.test(formData.password))
      newErrors.password =
        "Password must be at least 6 characters, include letters and numbers.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      age: Number(formData.age),
      mobile: formData.mobile,
      address: formData.address,
      password: formData.password,
      profile: {
        education_level: formData.education_level,
        target_exam: formData.target_exam
          .split(",")
          .map((exam) => exam.trim()),
        college_name: formData.college_name,
        location: formData.location,
      },
    };

    try {
      const res = await signupUser(payload);
      if (res.data.token) {
        localStorage.setItem("token", JSON.stringify(res.data.token));
      }
      alert("Signup Successful! Redirecting...");
      navigate("/login");
    } catch (err) {
      console.error("Signup Failed:", err);
      alert("Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1>Create an Account</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="signup-input"
          />
          {errors.name && <p className="error-text">{errors.name}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="signup-input"
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className="signup-input"
          />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="signup-input"
          />
          {errors.mobile && <p className="error-text">{errors.mobile}</p>}

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="signup-input"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="signup-input"
          />
          {errors.password && <p className="error-text">{errors.password}</p>}

          <input
            type="text"
            name="education_level"
            placeholder="Education Level"
            value={formData.education_level}
            onChange={handleChange}
            className="signup-input"
          />

          <input
            type="text"
            name="target_exam"
            placeholder="Target Exams (comma separated)"
            value={formData.target_exam}
            onChange={handleChange}
            className="signup-input"
          />

          <input
            type="text"
            name="college_name"
            placeholder="College Name"
            value={formData.college_name}
            onChange={handleChange}
            className="signup-input"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="signup-input"
          />

          <button
            type="submit"
            className="signup-button"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {loading && <div className="loader"></div>}

        <p className="signup-footer">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
