import express from "express";
import connectDB from "./db.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import QuestionRoutes from "./routes/QuestionRoutes.js";
import { jwtAuthMiddleware } from "./jwt.js";
import ProgressRoutes from "./routes/ProgressRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://mockpractice2k25.netlify.app",
    "https://mockp.in",
    "https://www.mockp.in",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "mockp-mcq", time: new Date().toISOString() });
});

// Auth + profile
app.use("/user", userRoutes);

// MCQ practice (aptitude / reasoning / english)
// GET is open to logged-in flow via client JWT; writes need admin inside routes
app.use("/question", jwtAuthMiddleware, QuestionRoutes);

// Progress requires login
app.use("/progress", jwtAuthMiddleware, ProgressRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log("✅ Server running on port", PORT);
  });
}

start();
