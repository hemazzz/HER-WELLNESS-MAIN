import express from "express";

import { chat } from "../controllers/chatbotController.js";

// 🔥 IMPORT AUTH
import  authMiddleware  from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 PROTECTED CHAT ROUTE
router.post(
  "/",
  authMiddleware,
  chat
);

export default router;