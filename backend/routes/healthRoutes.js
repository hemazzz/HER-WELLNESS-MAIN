import express from "express";

import {
  addHealthData,
  getHealthData,
  getWeeklyStats
} from "../controllers/healthController.js";

// 🔥 AUTH MIDDLEWARE
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// ❤️ ADD HEALTH DATA
router.post(
  "/",
  authMiddleware,
  addHealthData
);


// ❤️ GET ALL HEALTH DATA
router.get(
  "/",
  authMiddleware,
  getHealthData
);


// ❤️ WEEKLY STATS
router.get(
  "/weekly",
  authMiddleware,
  getWeeklyStats
);


export default router;