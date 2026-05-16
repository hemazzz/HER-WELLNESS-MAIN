import express from "express";
import {
  sendOtp,        // 🔥 ADD THIS
  register,
  login,
  verifyOTP,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";

const router = express.Router();

// 🔹 OTP FLOW
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOTP);

// 🔹 AUTH
router.post("/register", register);
router.post("/login", login);

// 🔹 PASSWORD RESET
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;