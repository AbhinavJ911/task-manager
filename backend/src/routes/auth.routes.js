const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const nodemailer = require("nodemailer");
const User = require("../models/User.model");
const authMiddleware = require("../middleware/auth.middleware");

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // Your email
    pass: process.env.SMTP_PASS, // Your app password
  },
});

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists first to give cleaner error
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already in use" });
    }

    const hash = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hash });
    res.status(201).json({ message: "Signup success" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email is already in use" });
    }
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error during signup" });
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ message: "User not found" });

  // If user signed up via Google and has no password
  if (!user.password) {
    return res.status(400).json({ message: "Please use Google Sign-In for this account" });
  }

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.status(400).json({ message: "Wrong password" });

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Save OTP to user with 5 min expiration
  user.loginOtp = otp;
  user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  // Send Email
  try {
    await transporter.sendMail({
      from: `"Task Manager" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Your Login Verification Code",
      text: `Your login verification code is: ${otp}. It will expire in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Task Manager Login Verification</h2>
          <p>Hello ${user.name},</p>
          <p>Someone (hopefully you) is trying to log in to your Task Manager account.</p>
          <p>Your verification code is:</p>
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1f2937;">${otp}</span>
          </div>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    // Even if email fails, we shouldn't necessarily block them if they can't get it, 
    // but in a strict 2FA system we must throw an error.
    return res.status(500).json({ message: "Failed to send verification email" });
  }

  res.json({
    message: "OTP sent to your email",
    requireOtp: true,
    email: user.email
  });
});

/**
 * POST /auth/verify-otp
 */
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.loginOtp !== otp) {
    return res.status(400).json({ message: "Invalid verification code" });
  }

  if (new Date() > user.otpExpiresAt) {
    return res.status(400).json({ message: "Verification code has expired" });
  }

  // OTP valid! Clear it
  user.loginOtp = null;
  user.otpExpiresAt = null;
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      plan: user.plan || "free",
    },
  });
});

/**
 * GET /auth/me — Get current user info
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      plan: user.plan || "free",
      planExpiresAt: user.planExpiresAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Google OAuth Routes
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    // Generate JWT for the authenticated user
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET);
    const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendURL}/auth/google/callback?token=${token}`);
  }
);

module.exports = router;

