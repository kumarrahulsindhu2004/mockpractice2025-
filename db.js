import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoUrl = process.env.MongoUrl || process.env.MongoLocalUrl;

export default async function connectDB() {
  if (!mongoUrl) {
    console.error("❌ MongoUrl is missing in .env");
    process.exit(1);
  }

  mongoose.set("bufferTimeoutMS", 20000);

  mongoose.connection.on("disconnected", () => {
    console.error("❌ MongoDB disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("✅ MongoDB reconnected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB error:", err.message);
  });

  try {
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.error(
      "👉 Check Atlas → Network Access: allow your IP (or 0.0.0.0/0 for testing)"
    );
    process.exit(1);
  }
}
