require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

/* =========================
   CORS CONFIG (CRITICAL)
========================= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://task-manager-git-main-abhinav-js-projects.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests from tools like Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// VERY IMPORTANT — handle preflight
app.options("*", cors());

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());

/* =========================
   ROUTES
========================= */
app.use("/auth", require("./routes/auth.routes"));
app.use("/tasks", require("./routes/task.routes"));

/* =========================
   DB + SERVER
========================= */
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
