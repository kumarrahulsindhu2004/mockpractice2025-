import express from "express";
import { User } from "../models/user.js";
import { generateToken, jwtAuthMiddleware } from "../jwt.js";
import generateOTP from "../utils/generateOTP.js";
import { sendOTPEmail } from "../utils/sendEmail.js";

const route = express.Router();

route.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const email = data.email?.trim().toLowerCase();

    if (!email || !data.password || !data.name) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const otp = generateOTP();

    const newUser = new User({
      ...data,
      email,
      role: "student",
      emailOTP: otp,
      emailOTPExpiry: Date.now() + 10 * 60 * 1000,
      isEmailVerified: false,
    });

    await newUser.save();
    await sendOTPEmail(email, otp);

    res.status(201).json({
      message: "Account created. OTP sent to email.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

route.post("/verify-email", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email: email?.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.emailOTP !== otp || user.emailOTPExpiry < Date.now()) {
      return res.status(400).json({
        error: "Invalid or expired OTP",
      });
    }

    user.isEmailVerified = true;
    user.emailOTP = undefined;
    user.emailOTPExpiry = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ error: "Verification failed" });
  }
});

route.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email?.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: "Email already verified" });
    }

    const otp = generateOTP();
    user.emailOTP = otp;
    user.emailOTPExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();
    await sendOTPEmail(email.trim().toLowerCase(), otp);

    res.json({ message: "OTP resent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to resend OTP" });
  }
});

route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.isEmailVerified === false) {
      return res.status(403).json({
        error: "Please verify your email with the OTP before logging in",
      });
    }

    const token = generateToken({
      id: user.id,
      role: user.role || "student",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "student",
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

route.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -emailOTP -emailOTPExpiry"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

route.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({
        error: "Current password and new password (min 6 chars) are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default route;
