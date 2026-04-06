import mongoose from "mongoose";

const dietSchema = new mongoose.Schema({
  userId: String,
  ingredients: [String],
  avoid: [String],
  plan: Object,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("DietPlan", dietSchema);