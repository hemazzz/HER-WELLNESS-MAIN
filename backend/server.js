import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import dietRoutes from "./routes/dietRoutes.js";

// ✅ load env FIRST
dotenv.config();

const app = express();

// ❌ REMOVE Gemini debug
// console.log("GEMINI KEY:", process.env.GEMINI_API_KEY);

// ✅ Optional debug (OpenRouter)
console.log("OPENROUTER KEY LOADED:", !!process.env.OPENROUTER_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatbotRoutes);
app.use("/api/diet", dietRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Her Wellness Backend Running 🚀");
});

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});