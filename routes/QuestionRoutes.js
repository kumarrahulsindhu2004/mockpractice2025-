import express from "express";
import { Question } from "../models/Question.js";
import { generateToken, jwtAuthMiddleware } from "../jwt.js";

const router = express.Router();

// ✅ Create Question (Admin Only)
router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    const question = new Question(req.body);
    const existing = await Question.findOne({
      question_text: req.body.question_text.trim(),
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



// ✅ Bulk Create Questions (Admin Only)
// ✅ Bulk Create Questions (No Admin Restriction)
router.post("/bulk", jwtAuthMiddleware, async (req, res) => {
  try {
    // ❌ REMOVED admin role check

    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: "Expected an array of questions" });
    }

    // Extract question texts (trimmed)
    const texts = req.body
      .filter(q => q.question_text)
      .map(q => q.question_text.trim());

    // Find already existing questions
    const existing = await Question.find({
      question_text: { $in: texts }
    }).select("question_text");

    const existingSet = new Set(existing.map(q => q.question_text));

    // Filter new questions only
    const newQuestions = req.body.filter(
      q => q.question_text && !existingSet.has(q.question_text.trim())
    );

    if (newQuestions.length === 0) {
      return res.status(400).json({ error: "All questions already exist" });
    }

    // Insert in bulk
    const inserted = await Question.insertMany(newQuestions, {
      ordered: false // continues even if one fails
    });

    res.status(201).json({
      insertedCount: inserted.length,
      inserted
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ✅ Get subcategories BEFORE :id route
router.get("/subcategory", async (req, res) => {
  try {
    const { category } = req.query;
    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    const subs = await Question.distinct("sub_category", { category });
    res.json(
      subs.map((s) => ({
        name: s,
        display_name: s.replace(/_/g, " "),
      }))
    );
  } catch (err) {
    console.error("Error in /subcategory:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get All Questions (supports filters)
router.get("/", async (req, res) => {
  try {
    // const { category, difficulty, sub_category } = req.query;
    // const filter = {};

    // if (category) filter.category = category;
    // if (difficulty) filter.difficulty = difficulty;
    // if (sub_category) filter.sub_category = sub_category;

    // const questions = await Question.find(filter);
    // res.json(questions);
    const { category, difficulty, sub_category, tags } = req.query;
const filter = {};

if (category) filter.category = category;
if (sub_category) filter.sub_category = sub_category;

if (difficulty) {
  filter.difficulty = { $in: difficulty.split(",") };
}

if (tags) {
  filter.tags = { $in: tags.split(",") };
}

const questions = await Question.find(filter);
res.json(questions);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET ALL TAGS (MUST BE ABOVE :id)
router.get("/tags", async (req, res) => {
  try {
    const tags = await Question.distinct("tags");
    res.json(tags);
  } catch (err) {
    console.error("Tags fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ Get Question by ID
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update Question (Admin Only)
router.put("/:id", jwtAuthMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Only admins can update questions" });
    }

    const updated = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Delete Question (Admin Only)
router.delete("/:id", jwtAuthMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Only admins can delete questions" });
    }

    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
