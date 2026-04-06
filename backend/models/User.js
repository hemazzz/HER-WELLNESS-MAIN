import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  otp: String,
  otpExpiry: Date,

  isVerified: { type: Boolean, default: false }
});

export default mongoose.model("User", userSchema);