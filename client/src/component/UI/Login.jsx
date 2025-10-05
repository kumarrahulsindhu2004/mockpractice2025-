import React from 'react'
import { useState } from 'react';
import axios from 'axios'
import { loginUser } from '../../services/api';
function Login() {
  const [email,setEmail]= useState("");
  const [password,setPassword]=useState("");

const handleSubmit = () => {
  const payload = { email, password };
  console.log("output", payload);

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
      console.log("Login Failed", err);
    });
};
  return (
    <div>
      <h1>Login Page</h1>
      <input
  type="text"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Aadhar Number"
/>

<input
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Password"
/>

      <button onClick={handleSubmit}>Login</button>
    </div>


  )
}

export default Login