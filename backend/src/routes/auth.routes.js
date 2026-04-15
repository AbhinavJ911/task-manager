const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User.model");
const authMiddleware = require("../middleware/auth.middleware");

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

