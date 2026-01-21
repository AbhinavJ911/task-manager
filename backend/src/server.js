require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

/**
 * CORS – allow Vercel frontend
 */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://task-manager-git-main-abhinav-js-projects.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use("/auth", require("./routes/auth.routes"));
app.use("/tasks", require("./routes/task.routes"));

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
