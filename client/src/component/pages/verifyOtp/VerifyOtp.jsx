import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyEmailOtp, resendOtp } from "../../../services/api";
import "./verifyOtp.css"

function VerifyOtp() {
  const navigate = useNavigate();
  const email = localStorage.getItem("otpEmail");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false); // ✅ NEW

  // ❗ redirect ONLY if email missing AND not verified
  if (!email && !verified) {
    navigate("/signup", { replace: true });
    return null;
  }

  const handleVerify = async () => {
    setLoading(true);
    try {
      await verifyEmailOtp({ email, otp });

      setVerified(true); // ✅ mark verified FIRST
      localStorage.removeItem("otpEmail");

      alert("Email verified successfully!");

      // ✅ hard redirect (no back navigation)
      navigate("/login", { replace: true });
    } catch (err) {
      alert(err?.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ email });
      alert("OTP resent to your email");
    } catch {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div className="otp-container">
      <h2>Email Verification</h2>
      <p>OTP sent to <b>{email}</b></p>

      <input
        type="text"
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        maxLength={6}
      />

      <button onClick={handleVerify} disabled={loading}>
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <p className="resend" onClick={handleResend}>
        Resend OTP
      </p>
    </div>
  );
}

export default VerifyOtp;
