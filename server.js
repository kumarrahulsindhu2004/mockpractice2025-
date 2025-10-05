import express from "express";
import connectDB from "./db.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import QuestionRoutes from "./routes/QuestionRoutes.js";
import { jwtAuthMiddleware } from "./jwt.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://mockpractice2k25.netlify.app/"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));  // ✅ This handles preflights automatically
app.use(express.json());

connectDB();

// ✅ Routes
app.use("/user", userRoutes);
app.use("/question", jwtAuthMiddleware, QuestionRoutes);

app.listen(PORT, () => {
  console.log("✅ Server running on port", PORT);
});
