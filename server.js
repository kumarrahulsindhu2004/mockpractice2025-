import express from "express";
import connectDB from "./db.js";
import cors from 'cors'

import userRoutes from "./routes/userRoutes.js"
import QuestionRoutes from './routes/QuestionRoutes.js'
import { jwtAuthMiddleware } from "./jwt.js";
const app = express();
// app.use(express.json())
const PORT = process.env.PORT || 3000;
// CORS configuration - Add this before other middleware
const corsOptions = {
  origin: [

    'http://localhost:5173',  // Vite default port
    'https://mockpractice2025.netlify.app/'  ,// Production frontend URL
    // 'https://mockpractice2025.onrender.com'
  ],
  credentials: true,  // Allow cookies/auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
// ✅ Handle preflight requests explicitly
// app.options("*", cors(corsOptions));

app.use(express.json());
connectDB();
app.use('/user',userRoutes)
app.use('/question',jwtAuthMiddleware,QuestionRoutes)
app.listen(PORT,()=>{
    console.log('Server on locahost',PORT);
    
})