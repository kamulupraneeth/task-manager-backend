const express = require("express");
const Task = require("../models/Task");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

//Middleware to verify JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });
  jwt.verify(token, "your_jwt_secret", (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.userId = decoded.userId;
    next();
  });
};

// // Create a task
router.post("/tasks", authenticate, async (req, res) => {
  const { title, description } = req.body;
  try {
    const task = new Task({ title, description, user: req.userId });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// // Get tasks
router.get("/tasks", authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// //Get a specific task

router.get("/tasks/:id", authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found!" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// //Update task
router.put("/tasks/:id", authenticate, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// //Delete task

router.delete("/tasks/:id", authenticate, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
