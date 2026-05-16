import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authMiddleware from "./middleware/authMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import dietRoutes from "./routes/dietRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

// ✅ LOAD ENV
dotenv.config();

const app = express();

// ✅ DEBUG
console.log(
  "🔍 MONGO URI loaded:",
  !!process.env.MONGO_URI
);

// ✅ CORS
app.use(
  cors({
    origin: "http://localhost:8082",
    credentials: true,
  })
);

// ✅ JSON
app.use(express.json());

// ✅ ROUTES
app.use("/api/auth", authRoutes);

app.use("/api/chat", chatbotRoutes);

app.use("/api/diet", dietRoutes);

app.use("/api/health", healthRoutes);

// 🔥 PROFILE ROUTE WITH AUTH
app.use(
  "/api/profile",
  authMiddleware,
  profileRoutes
);

// ✅ ROOT
app.get("/", (req, res) => {
  res.send("🚀 Her Wellness Backend Running");
});

// ✅ ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  res.status(500).json({
    message: "Internal Server Error",
  });
});

// ✅ DB CONNECT
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log("✅ MongoDB Connected");

  } catch (err) {

    console.log(
      "❌ MongoDB Error:",
      err.message
    );

    process.exit(1);
  }
};

// ✅ START SERVER
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      `🚀 Server running on port ${PORT}`
    );
  });
});