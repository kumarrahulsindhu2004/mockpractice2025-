import mongoose from "mongoose";

const userQuestionProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    selectedOptionIndex: {
      type: Number,
      required: true,
    },
    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/* 🔥 VERY IMPORTANT INDEX (prevents duplicates) */
userQuestionProgressSchema.index(
  { user: 1, question: 1 },
  { unique: true }
);

export const UserQuestionProgress = mongoose.model(
  "UserQuestionProgress",
  userQuestionProgressSchema
);

