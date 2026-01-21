const express = require("express");
const router = express.Router();
const Task = require("../models/Task.model");
const authMiddleware = require("../middleware/auth.middleware");

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
 * CREATE task (supports deadline)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    const task = await Task.create({
      title,
      description,
      deadline: deadline ? new Date(deadline) : undefined,
      user: req.user.id,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * TOGGLE completed status
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

    task.completed = !task.completed;
    await task.save();

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
