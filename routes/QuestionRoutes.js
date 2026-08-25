import express from "express";
import { Question } from "../models/Question.js";
import { jwtAuthMiddleware, adminMiddleware } from "../jwt.js";

const router = express.Router();

const PRACTICE_CATEGORIES = ["aptitude", "reasoning", "english"];

/** Hide correct answers from client until they submit */
function sanitizeQuestion(q) {
  const doc = q.toObject ? q.toObject() : { ...q };
  return {
    _id: doc._id,
    category: doc.category,
    sub_category: doc.sub_category,
    difficulty: doc.difficulty,
    question_text: doc.question_text,
    options: (doc.options || []).map((o) => ({ option: o.option })),
    tags: doc.tags || [],
    // explanation shown after attempt; omit until answered
  };
}

function sanitizeWithReveal(q, { includeExplanation = false } = {}) {
  const base = sanitizeQuestion(q);
  const doc = q.toObject ? q.toObject() : q;
  if (includeExplanation) {
    base.explanation = doc.explanation || "";
  }
  return base;
}

// Create question (admin only)
router.post("/", jwtAuthMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (!PRACTICE_CATEGORIES.includes(req.body.category)) {
      return res.status(400).json({
        error: "Category must be aptitude, reasoning, or english",
      });
    }

    const text = req.body.question_text?.trim();
    if (!text) {
      return res.status(400).json({ error: "question_text is required" });
    }

    const existing = await Question.findOne({ question_text: text });
    if (existing) {
      return res.status(400).json({ error: "Question already exists" });
    }

    const question = new Question({
      ...req.body,
      question_text: text,
      created_by: req.user.id,
    });
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Bulk create (admin only)
router.post("/bulk", jwtAuthMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: "Expected an array of questions" });
    }

    const prepared = req.body
      .filter((q) => q.question_text && PRACTICE_CATEGORIES.includes(q.category))
      .map((q) => ({
        ...q,
        question_text: q.question_text.trim(),
        created_by: req.user.id,
      }));

    const texts = prepared.map((q) => q.question_text);
    const existing = await Question.find({
      question_text: { $in: texts },
    }).select("question_text");

    const existingSet = new Set(existing.map((q) => q.question_text));
    const newQuestions = prepared.filter(
      (q) => !existingSet.has(q.question_text)
    );

    if (newQuestions.length === 0) {
      return res.status(400).json({ error: "All questions already exist" });
    }

    const inserted = await Question.insertMany(newQuestions, { ordered: false });
    res.status(201).json({
      insertedCount: inserted.length,
      inserted,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Practice Hub summary — real totals from DB (not limited page size)
router.get("/hub-summary", async (_req, res) => {
  try {
    const rows = await Question.aggregate([
      { $match: { category: { $in: PRACTICE_CATEGORIES } } },
      {
        $group: {
          _id: {
            category: "$category",
            sub_category: "$sub_category",
          },
          count: { $sum: 1 },
          easy: {
            $sum: { $cond: [{ $eq: ["$difficulty", "easy"] }, 1, 0] },
          },
          medium: {
            $sum: { $cond: [{ $eq: ["$difficulty", "medium"] }, 1, 0] },
          },
          hard: {
            $sum: { $cond: [{ $eq: ["$difficulty", "hard"] }, 1, 0] },
          },
        },
      },
    ]);

    const byCategory = {};
    for (const name of PRACTICE_CATEGORIES) {
      byCategory[name] = {
        name,
        totalQuestions: 0,
        topicCount: 0,
        topics: [],
      };
    }

    for (const row of rows) {
      const category = row._id.category;
      const sub = row._id.sub_category || "general";
      if (!byCategory[category]) continue;

      byCategory[category].totalQuestions += row.count;
      byCategory[category].topicCount += 1;

      const majority =
        row.easy >= row.medium && row.easy >= row.hard
          ? "easy"
          : row.hard >= row.medium && row.hard >= row.easy
            ? "hard"
            : "medium";

      byCategory[category].topics.push({
        name: sub,
        display_name: String(sub).replace(/_/g, " "),
        count: row.count,
        difficulty: majority,
        easy: row.easy,
        medium: row.medium,
        hard: row.hard,
      });
    }

    for (const name of PRACTICE_CATEGORIES) {
      byCategory[name].topics.sort((a, b) =>
        a.display_name.localeCompare(b.display_name)
      );
    }

    const categories = PRACTICE_CATEGORIES.map((name) => byCategory[name]);
    const totals = {
      questions: categories.reduce((s, c) => s + c.totalQuestions, 0),
      topics: categories.reduce((s, c) => s + c.topicCount, 0),
      categories: categories.filter((c) => c.totalQuestions > 0).length,
    };

    res.json({ categories, totals });
  } catch (err) {
    console.error("hub-summary error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Subcategories for a category (with live question counts)
router.get("/subcategory", async (req, res) => {
  try {
    const { category } = req.query;
    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }
    if (!PRACTICE_CATEGORIES.includes(category)) {
      return res.status(400).json({
        error: "Category must be aptitude, reasoning, or english",
      });
    }

    const rows = await Question.aggregate([
      { $match: { category } },
      {
        $group: {
          _id: "$sub_category",
          count: { $sum: 1 },
          easy: {
            $sum: { $cond: [{ $eq: ["$difficulty", "easy"] }, 1, 0] },
          },
          medium: {
            $sum: { $cond: [{ $eq: ["$difficulty", "medium"] }, 1, 0] },
          },
          hard: {
            $sum: { $cond: [{ $eq: ["$difficulty", "hard"] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(
      rows
        .filter((r) => r._id)
        .map((r) => {
          const difficulty =
            r.easy >= r.medium && r.easy >= r.hard
              ? "easy"
              : r.hard >= r.medium && r.hard >= r.easy
                ? "hard"
                : "medium";
          return {
            name: r._id,
            display_name: String(r._id).replace(/_/g, " "),
            count: r.count,
            difficulty,
          };
        })
    );
  } catch (err) {
    console.error("Error in /subcategory:", err);
    res.status(500).json({ error: err.message });
  }
});

// List questions (no correct answers)
router.get("/", async (req, res) => {
  try {
    const { category, difficulty, sub_category, tags, page, limit } = req.query;
    const filter = {};

    if (category) {
      if (!PRACTICE_CATEGORIES.includes(category)) {
        return res.status(400).json({
          error: "Category must be aptitude, reasoning, or english",
        });
      }
      filter.category = category;
    } else {
      filter.category = { $in: PRACTICE_CATEGORIES };
    }

    if (sub_category) filter.sub_category = sub_category;
    if (difficulty) {
      filter.difficulty = { $in: difficulty.split(",") };
    }
    if (tags) {
      filter.tags = { $in: tags.split(",") };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [questions, total] = await Promise.all([
      Question.find(filter).skip(skip).limit(limitNum).lean(),
      Question.countDocuments(filter),
    ]);

    res.json({
      questions: questions.map((q) => sanitizeQuestion(q)),
      total,
      page: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tags
router.get("/tags", async (req, res) => {
  try {
    const tags = await Question.distinct("tags", {
      category: { $in: PRACTICE_CATEGORIES },
    });
    res.json(tags.filter(Boolean));
  } catch (err) {
    console.error("Tags fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Single question (no correct answer)
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    if (!PRACTICE_CATEGORIES.includes(question.category)) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.json(sanitizeWithReveal(question));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update (admin)
router.put("/:id", jwtAuthMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (req.body.category && !PRACTICE_CATEGORIES.includes(req.body.category)) {
      return res.status(400).json({
        error: "Category must be aptitude, reasoning, or english",
      });
    }

    const updated = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete (admin)
router.delete("/:id", jwtAuthMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
