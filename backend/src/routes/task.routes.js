const express = require("express");
const router = express.Router();
const Task = require("../models/Task.model");
const User = require("../models/User.model");
const authMiddleware = require("../middleware/auth.middleware");

// Task limits per plan
const TASK_LIMITS = {
  free: 5,
  basic: 25,
  advanced: Infinity,
};

/**
 * GET all tasks for logged-in user
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * CREATE task (supports deadline, priority, status, tags)
 * Enforces task limits based on user plan
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Check task limit
    const user = await User.findById(req.user.id);
    const currentTaskCount = await Task.countDocuments({ user: req.user.id });
    const limit = TASK_LIMITS[user.plan || "free"];

    if (currentTaskCount >= limit) {
      return res.status(403).json({
        message: `Task limit reached. Your ${user.plan || "free"} plan allows ${limit} tasks. Upgrade to add more!`,
        limitReached: true,
        currentPlan: user.plan || "free",
      });
    }

    const { title, description, deadline, priority, status, tags } = req.body;

    const task = await Task.create({
      title,
      description,
      deadline: deadline ? new Date(deadline) : undefined,
      priority: priority || "medium",
      status: status || "todo",
      tags: tags || [],
      user: req.user.id,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * TOGGLE completed status (Legacy support + Status update)
 */
router.patch("/:id/toggle", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Toggle logic: if done -> todo, if anything else -> done
    if (task.status === "done") {
        task.status = "todo";
        task.completed = false;
    } else {
        task.status = "done";
        task.completed = true;
    }
    
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * UPDATE task (General update)
 */
router.patch("/:id", authMiddleware, async (req, res) => {
    try {
      const updates = req.body;
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        updates,
        { new: true }
      );
  
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      res.json(task);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

/**
 * DELETE task
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
