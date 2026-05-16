import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
  },

  otp: {
    type: String,
  },

  otpExpiry: {
    type: Date,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  // 🔥 PROFILE FIELDS

  name: {
    type: String,
    default: "",
  },

  age: {
    type: Number,
    default: 0,
  },

  height: {
    type: Number,
    default: 0,
  },

  weight: {
    type: Number,
    default: 0,
  },

  allergies: {
    type: String,
    default: "",
  },

  lastPeriodDate: {
    type: String,
    default: "",
  },

  cycleLength: {
    type: Number,
    default: 28,
  },

  medicalConditions: {
    type: [String],
    default: [],
  },

}, {
  timestamps: true
});

export default mongoose.model(
  "User",
  userSchema
);