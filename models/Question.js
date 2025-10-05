import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["aptitude", "reasoning", "english", "computer", "communication"],
      required: true,
    },
    sub_category: {
      type: String, // e.g. "probability", "grammar", "dbms"
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    question_text: {
     type: String,
  required: true,
  unique: true,
  trim: true,
  lowercase: true
    },
    options: [
      {
        option: { type: String },
        is_correct: { type: Boolean, default: false },
      },
    ],
    explanation: {
      type: String,
    },
    tags: [{ type: String }], // e.g. ["placement", "tcs", "math"]
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Question = mongoose.model("Question", questionSchema);
