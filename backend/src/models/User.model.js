const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, default: null },
  googleId: { type: String, default: null },
  plan: {
    type: String,
    enum: ["free", "basic", "advanced"],
    default: "free",
  },
  stripeCustomerId: { type: String, default: null },
  subscriptionId: { type: String, default: null },
  planExpiresAt: { type: Date, default: null },
  loginOtp: { type: String, default: null },
  otpExpiresAt: { type: Date, default: null },
});

module.exports = mongoose.model("User", userSchema);
