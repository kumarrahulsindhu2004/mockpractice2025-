import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle form submit
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
        target_exam: formData.target_exam.split(",").map((exam) => exam.trim()), // convert to array
        college_name: formData.college_name,
        location: formData.location,
      },
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/signup`,
        payload
      );

      // save token (assuming backend returns token in res.data.token)
      if (res.data.token) {
        localStorage.setItem("token", JSON.stringify(res.data.token));
      }

      alert("Signup Successful! Redirecting...");

      // redirect to dashboard (protected route)
      navigate("/practice");

      // reset form
      setFormData({
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
    } catch (err) {
      console.error("Signup Failed:", err);
      alert("Signup Failed");
    }
  };

  return (
    <div>
      <h1>SignUp Page</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name"
          value={formData.name} onChange={handleChange} />
        <br />

        <input type="email" name="email" placeholder="Email"
          value={formData.email} onChange={handleChange} />
        <br />

        <input type="number" name="age" placeholder="Age"
          value={formData.age} onChange={handleChange} />
        <br />

        <input type="text" name="mobile" placeholder="Mobile"
          value={formData.mobile} onChange={handleChange} />
        <br />

        <input type="text" name="address" placeholder="Address"
          value={formData.address} onChange={handleChange} />
        <br />

        <input type="password" name="password" placeholder="Password"
          value={formData.password} onChange={handleChange} />
        <br />

        <input type="text" name="education_level" placeholder="Education Level"
          value={formData.education_level} onChange={handleChange} />
        <br />

        <input type="text" name="target_exam" placeholder="Target Exams (comma separated)"
          value={formData.target_exam} onChange={handleChange} />
        <br />

        <input type="text" name="college_name" placeholder="College Name"
          value={formData.college_name} onChange={handleChange} />
        <br />

        <input type="text" name="location" placeholder="Location"
          value={formData.location} onChange={handleChange} />
        <br />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
