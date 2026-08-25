import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyEmailOtp, resendOtp } from "../../../services/api";
import toast from "react-hot-toast";
import "./verifyOtp.css";

function VerifyOtp() {
  const navigate = useNavigate();
  const email = localStorage.getItem("otpEmail");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  if (!email && !verified) {
    navigate("/signup", { replace: true });
    return null;
  }

  const handleVerify = async () => {
    if (otp.trim().length < 4) {
      toast.error("Enter the OTP sent to your email");
      return;
    }

    setLoading(true);
    try {
      await verifyEmailOtp({ email, otp });
      setVerified(true);
      localStorage.removeItem("otpEmail");
      toast.success("Email verified successfully");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ email });
      toast.success("OTP resent to your email");
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-card">
        <div className="otp-brand">P</div>
        <h2>Verify your email</h2>
        <p>
          We sent a code to <b>{email}</b>
        </p>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          maxLength={6}
          inputMode="numeric"
        />

        <button onClick={handleVerify} disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button type="button" className="otp-resend" onClick={handleResend}>
          Resend OTP
        </button>
      </div>
    </div>
  );
}

export default VerifyOtp;
