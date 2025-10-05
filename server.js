import express from "express";
import connectDB from "./db.js";
import cors from 'cors'

import userRoutes from "./routes/userRoutes.js"
import QuestionRoutes from './routes/QuestionRoutes.js'
import { jwtAuthMiddleware } from "./jwt.js";
const app = express();
app.use(express.json())
const PORT = process.env.PORT || 3000;
// CORS configuration - Add this before other middleware
const corsOptions = {
  origin: [
    'http://localhost:3000',  // Your React dev server
    'http://localhost:5173',  // Vite default port
    'https://your-frontend-domain.com'  // Production frontend URL
  ],
  credentials: true,  // Allow cookies/auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions)); 
connectDB();
app.use('/user',userRoutes)
app.use('/question',jwtAuthMiddleware,QuestionRoutes)
app.listen(PORT,()=>{
    console.log('Server on locahost',PORT);
    
})