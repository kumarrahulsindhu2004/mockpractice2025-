import express from "express";
import { jwtAuthMiddleware } from "../jwt.js";
import { UserQuestionProgress } from "../models/UserQuestionProgress.js";

const router = express.Router();

/**
 * POST /progress
 * Save question attempt
 */
router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { questionId, selectedOptionIndex, isCorrect } = req.body;

    const progress = await UserQuestionProgress.findOneAndUpdate(
      { user: userId, question: questionId },
      {
        user: userId,
        question: questionId,
        selectedOptionIndex,
        isCorrect,
        attemptedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.status(200).json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /progress/my
 * Get all attempted questions for logged-in user
 */
router.get("/my", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const progress = await UserQuestionProgress.find({ user: userId })
      // .select("question isCorrect selectedOptionIndex");
     .populate("question", "category sub_category question_text")
  .select("question isCorrect selectedOptionIndex attemptedAt")
  .sort({ attemptedAt: -1 })
  .limit(5);

    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /progress/solved
 * Returns solved question IDs for logged-in user
 */
router.get("/solved", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const solved = await UserQuestionProgress.find(
      { user: userId },
      { question: 1, _id: 0 }
    );

    res.json(solved.map(p => p.question.toString()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /progress/stats
router.get("/stats", jwtAuthMiddleware, async (req, res) => {
  const userId = req.user.id;

  const attempts = await UserQuestionProgress.find({ user: userId });

  const total = attempts.length;
  const correct = attempts.filter(a => a.isCorrect).length;

  const accuracy = total === 0 ? 0 : Math.round((correct / total) * 100);

  res.json({
    totalSolved: correct,
    totalAttempted: total,
    accuracy,
    
  });
});


export default router;
