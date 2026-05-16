import express from "express";

import {
  generateDietPlan,
  getDietHistory
} from "../controllers/dietController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ TEST ROUTE
router.get("/test", (req, res) => {

  res.json({
    message: "Diet route working ✅"
  });

});

// 🤖 GENERATE AI DIET PLAN
router.post(
  "/diet-plan",
  authMiddleware,
  generateDietPlan
);

// 📜 GET DIET HISTORY
router.get(
  "/history",
  authMiddleware,
  getDietHistory
);

export default router;