import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
// cosnt mongooseUrl = process.env.MongoUrl || process.env.MongoLocalUrl
const mongoUrl = process.env.MongoUrl || process.env.MongoLocalUrl;

export default async function connectDB() {
    try {
         console.log("Mongo URL from env:", mongoUrl); // ✅ correct name
            await mongoose.connect(mongoUrl, {
              useNewUrlParser: true,
              useUnifiedTopology: true,
            });
            console.log("✅ MongoDB connected");
    } catch (error) {
     console.error("❌ Error found:", error.message);   
    }
}