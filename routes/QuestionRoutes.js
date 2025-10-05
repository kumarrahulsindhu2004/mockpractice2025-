import express from "express";
import { Question } from "../models/Question.js";
import { generateToken,jwtAuthMiddleware }from "../jwt.js";


const router = express.Router();

// Create Question (Admin Only)
router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    const question = new Question(req.body);
    const existing = await Question.findOne({ 
      question_text: req.body.question_text.trim() 
    });
    if (existing) {
      return res.status(400).json({ error: "Question already exists" });
    }
    await question.save();
    res.status(201).json(question);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Questions (with filters)
router.get("/", async (req, res) => {
  try {
    const { category, difficulty, sub_category } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (sub_category) filter.sub_category = sub_category;

    const questions = await Question.find(filter);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Question by ID
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Question
router.put("/:id", jwtAuthMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can update questions" });
    }

    const updated = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Question
router.delete("/:id", jwtAuthMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can delete questions" });
    }

    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
