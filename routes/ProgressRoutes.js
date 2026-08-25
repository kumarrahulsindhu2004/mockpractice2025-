import express from "express";
import { jwtAuthMiddleware } from "../jwt.js";
import { Question } from "../models/Question.js";
import { UserQuestionProgress } from "../models/UserQuestionProgress.js";

const router = express.Router();

const PRACTICE_CATEGORIES = ["aptitude", "reasoning", "english"];

/**
 * POST /progress
 * Body: { questionId, selectedOptionIndex }
 * Server verifies correctness (client cannot cheat)
 */
router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { questionId, selectedOptionIndex } = req.body;

    if (questionId == null || selectedOptionIndex == null) {
      return res.status(400).json({
        error: "questionId and selectedOptionIndex are required",
      });
    }

    const question = await Question.findById(questionId);
    if (!question || !PRACTICE_CATEGORIES.includes(question.category)) {
      return res.status(404).json({ error: "Question not found" });
    }

    const idx = Number(selectedOptionIndex);
    if (
      !Number.isInteger(idx) ||
      idx < 0 ||
      idx >= (question.options?.length || 0)
    ) {
      return res.status(400).json({ error: "Invalid option index" });
    }

    const correctIndex = question.options.findIndex((o) => o.is_correct);
    const isCorrect = idx === correctIndex;

    const progress = await UserQuestionProgress.findOneAndUpdate(
      { user: userId, question: questionId },
      {
        user: userId,
        question: questionId,
        selectedOptionIndex: idx,
        isCorrect,
        attemptedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      progress,
      isCorrect,
      correctIndex,
      explanation: question.explanation || "",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /progress/my
 * Recent attempts for dashboard
 */
router.get("/my", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const progress = await UserQuestionProgress.find({ user: userId })
      .populate("question", "category sub_category question_text difficulty")
      .select("question isCorrect selectedOptionIndex attemptedAt")
      .sort({ attemptedAt: -1 })
      .limit(10);

    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /progress/history
 * Full attempt history (paginated)
 */
router.get("/history", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;
    const { category } = req.query;

    const filter = { user: userId };
    let progressQuery = UserQuestionProgress.find(filter)
      .populate("question", "category sub_category question_text difficulty")
      .select("question isCorrect selectedOptionIndex attemptedAt")
      .sort({ attemptedAt: -1 });

    const all = await progressQuery;
    const filtered = category
      ? all.filter((p) => p.question?.category === category)
      : all;

    const total = filtered.length;
    const items = filtered.slice(skip, skip + limit);

    res.json({
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit) || 1,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /progress/solved
 * Only correctly answered question IDs (for accuracy stats)
 */
router.get("/solved", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const solved = await UserQuestionProgress.find(
      { user: userId, isCorrect: true },
      { question: 1, _id: 0 }
    );

    res.json(solved.map((p) => p.question.toString()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /progress/attempted
 * All attempted question IDs (correct OR wrong) — never show these again in practice
 */
router.get("/attempted", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const attempted = await UserQuestionProgress.find(
      { user: userId },
      { question: 1, _id: 0 }
    );

    res.json(attempted.map((p) => p.question.toString()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /progress/attempts
 * Map of questionId -> { selectedOptionIndex, isCorrect, correctIndex }
 * Used to restore UI state without leaking all answers globally
 */
router.get("/attempts", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, sub_category } = req.query;

    const attempts = await UserQuestionProgress.find({ user: userId }).populate(
      "question",
      "category sub_category options"
    );

    const map = {};
    for (const a of attempts) {
      const q = a.question;
      if (!q) continue;
      if (category && q.category !== category) continue;
      if (sub_category && q.sub_category !== sub_category) continue;
      if (!PRACTICE_CATEGORIES.includes(q.category)) continue;

      const correctIndex = (q.options || []).findIndex((o) => o.is_correct);
      map[q._id.toString()] = {
        selectedOptionIndex: a.selectedOptionIndex,
        isCorrect: a.isCorrect,
        correctIndex,
      };
    }

    res.json(map);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /progress/hub
 * Attempted / correct counts for Practice Hub (dynamic per user)
 */
router.get("/hub", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const attempts = await UserQuestionProgress.find({ user: userId }).populate(
      "question",
      "category sub_category"
    );

    const byCategory = {};
    const bySubcategory = {};

    for (const name of PRACTICE_CATEGORIES) {
      byCategory[name] = { attempted: 0, correct: 0 };
    }

    for (const a of attempts) {
      const q = a.question;
      if (!q || !PRACTICE_CATEGORIES.includes(q.category)) continue;

      byCategory[q.category].attempted += 1;
      if (a.isCorrect) byCategory[q.category].correct += 1;

      const subKey = `${q.category}::${q.sub_category || "general"}`;
      if (!bySubcategory[subKey]) {
        bySubcategory[subKey] = {
          category: q.category,
          sub_category: q.sub_category || "general",
          attempted: 0,
          correct: 0,
        };
      }
      bySubcategory[subKey].attempted += 1;
      if (a.isCorrect) bySubcategory[subKey].correct += 1;
    }

    const totalAttempted = Object.values(byCategory).reduce(
      (s, c) => s + c.attempted,
      0
    );
    const totalCorrect = Object.values(byCategory).reduce(
      (s, c) => s + c.correct,
      0
    );

    res.json({
      byCategory,
      bySubcategory: Object.values(bySubcategory),
      totals: {
        attempted: totalAttempted,
        correct: totalCorrect,
        accuracy:
          totalAttempted === 0
            ? 0
            : Math.round((totalCorrect / totalAttempted) * 100),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /progress/stats
 */
router.get("/stats", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const attempts = await UserQuestionProgress.find({ user: userId });

    const total = attempts.length;
    const correct = attempts.filter((a) => a.isCorrect).length;
    const accuracy = total === 0 ? 0 : Math.round((correct / total) * 100);

    res.json({
      totalSolved: correct,
      totalAttempted: total,
      accuracy,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
