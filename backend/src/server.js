require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");
const connectDB = require("./config/db");

const app = express();

/**
 * CORS – allow Vercel frontend
 */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL,
      /^https:\/\/task-manager(-.*)?\.vercel\.app$/i,
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(express.json());

/**
 * Session + Passport (needed for Google OAuth flow)
 */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", require("./routes/auth.routes"));
app.use("/tasks", require("./routes/task.routes"));
app.use("/subscription", require("./routes/subscription.routes"));

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
