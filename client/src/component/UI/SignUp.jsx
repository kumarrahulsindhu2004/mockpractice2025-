// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { signupUser } from "../../services/api";
// import "./signup.css";

// function SignUp() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     education_level: "",
//     target_exam: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const payload = {
//       name: formData.name,
//       email: formData.email,
//       password: formData.password,
//       profile: {
//         education_level: formData.education_level,
//         target_exam: formData.target_exam
//           .split(",")
//           .map((e) => e.trim()),
//       },
//     };

//     try {
//       await signupUser(payload);
//       alert("Account created successfully!");
//       navigate("/login");
//     } catch (err) {
//       alert("Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="signup-modern">
//       {/* Left Section */}
//       <div className="signup-left">
//         <h1>Mock Practice</h1>
//         <p>
//           Practice smarter. Get exam-ready with curated questions and
//           explanations.
//         </p>

//         <ul>
//           <li>✅ Curated practice sets</li>
//           <li>✅ Real exam patterns</li>
//           <li>✅ Track learning progress</li>
//         </ul>
//       </div>

//       {/* Right Section */}
//       <div className="signup-right">
//         <div className="signup-box">
//           <h2>Create your account</h2>
//           <p className="subtitle">
//             Start your learning journey today 🚀
//           </p>

//           <form onSubmit={handleSubmit}>
//             <input
//               type="text"
//               name="name"
//               placeholder="Full name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />

//             <input
//               type="email"
//               name="email"
//               placeholder="Email address"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />

//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />

//             <input
//               type="text"
//               name="education_level"
//               placeholder="Education (e.g. B.Tech, 12th)"
//               value={formData.education_level}
//               onChange={handleChange}
//             />

//             <input
//               type="text"
//               name="target_exam"
//               placeholder="Target exams (SSC, Banking, CAT)"
//               value={formData.target_exam}
//               onChange={handleChange}
//             />

//             <button type="submit" disabled={loading}>
//               {loading ? "Creating account..." : "Create Account"}
//             </button>
//           </form>

//           <p className="login-link">
//             Already have an account?{" "}
//             <span onClick={() => navigate("/login")}>Login</span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignUp;









// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { signupUser } from "../../services/api";
// import "./signup.css";

// function SignUp() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     education_level: "",
//     target_exam: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await signupUser(formData);
//       alert("Account created successfully!");
//       navigate("/login");
//     } catch (err) {
//       alert("Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="signup-shell">
//       <div className="signup-container">

//         {/* LEFT INFO */}
//         <div className="panel-left">
//           <div className="logo-box">P</div>

//           <h1>Mock Practice</h1>
//           <p>
//             Practice smarter. Get exam-ready with curated questions
//             and AI-driven insights.
//           </p>

//           <ul>
//             <li><span>✓</span> Curated practice sets</li>
//             <li><span>✓</span> Real exam patterns</li>
//             <li><span>✓</span> Track learning progress</li>
//           </ul>
//         </div>

//         {/* RIGHT FORM */}
//         <div className="panel-right">
//           <h2>Create your account</h2>
//           <p className="subtitle">Start your learning journey today 🚀</p>

//           <form onSubmit={handleSubmit}>

//             <div className="grid-two">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Full Name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />

//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email Address"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />

//             <input
//               type="text"
//               name="education_level"
//               placeholder="Education (e.g. B.Tech, 12th)"
//               value={formData.education_level}
//               onChange={handleChange}
//             />

//             <input
//               type="text"
//               name="target_exam"
//               placeholder="Target Exams (SSC, Banking, CAT)"
//               value={formData.target_exam}
//               onChange={handleChange}
//             />

//             <button type="submit" disabled={loading}>
//               {loading ? "Creating..." : "Create Account"}
//             </button>

//           </form>

//           <p className="login-text">
//             Already have an account?
//             <span onClick={() => navigate("/login")}> Login here</span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignUp;









import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../services/api";
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

      // ✅ Save email for OTP page
      localStorage.setItem("otpEmail", formData.email);

      navigate("/verify-otp");
    } catch (err) {
      alert(err?.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-shell">
      <div className="signup-container">

        <div className="panel-left">
          <div className="logo-box">P</div>
          <h1>Mock Practice</h1>
          <p>Practice smarter. Get exam-ready with curated questions.</p>
        </div>

        <div className="panel-right">
          <h2>Create your account</h2>
          <p className="subtitle">Start your learning journey 🚀</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

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
              placeholder="Target Exams"
              value={formData.target_exam}
              onChange={handleChange}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="login-text">
            Already have an account?
            <span onClick={() => navigate("/login")}> Login here</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
