import express from "express";
import { generateDietPlan, getDietHistory } from "../controllers/dietController.js";

const router = express.Router();

// ✅ Test route
router.get("/test", (req, res) => {
  res.json({ message: "Diet route working ✅" });
});

// 🤖 Generate diet plan
router.post("/diet-plan", generateDietPlan);

// 📜 Get diet history (NEW 🔥)
router.get("/history", getDietHistory);

export default router;