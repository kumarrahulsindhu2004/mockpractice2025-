import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../services/api";
import "./signup.css";

function SignUp() {
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      email: formData.email,
      age: Number(formData.age),
      mobile: formData.mobile,
      address: formData.address,
      password: formData.password,
      profile: {
        education_level: formData.education_level,
        target_exam: formData.target_exam.split(",").map((exam) => exam.trim()),
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
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1>Create an Account</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="signup-input" />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="signup-input" />
          <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className="signup-input" />
          <input type="text" name="mobile" placeholder="Mobile" value={formData.mobile} onChange={handleChange} className="signup-input" />
          <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="signup-input" />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="signup-input" />
          <input type="text" name="education_level" placeholder="Education Level" value={formData.education_level} onChange={handleChange} className="signup-input" />
          <input type="text" name="target_exam" placeholder="Target Exams (comma separated)" value={formData.target_exam} onChange={handleChange} className="signup-input" />
          <input type="text" name="college_name" placeholder="College Name" value={formData.college_name} onChange={handleChange} className="signup-input" />
          <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="signup-input" />

          <button type="submit" className="signup-button">Sign Up</button>
        </form>

        <p className="signup-footer">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
