import mongoose from "mongoose";

const healthSchema =
  new mongoose.Schema({

    // 🔥 DATE
    date: {
      type: String,
      required: true
    },

    // 🔥 USER LINK
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // 🔥 BASIC HEALTH DATA
    sleepHours: {
      type: Number,
      default: 0
    },

    waterIntake: {
      type: Number,
      default: 0
    },

    stepsWalked: {
      type: Number,
      default: 0
    },

    dietQuality: {
      type: Number,
      default: 0
    },

    stressLevel: {
      type: Number,
      default: 0
    },

    // 🔥 KCAL + PROTEIN
    calories: {
      type: Number,
      default: 0
    },

    protein: {
      type: Number,
      default: 0
    },

    // 🍱 MEALS
    meals: {

      protein: {
        type: Boolean,
        default: false
      },

      fruits: {
        type: Boolean,
        default: false
      },

      junk: {
        type: Boolean,
        default: false
      }

    },

    // 🤖 AI INSIGHTS
    insights: {
      type: [String],
      default: []
    },

    // 🤖 SUGGESTIONS
    suggestionsFollowed: {
      type: Number,
      default: 0
    },

    // 🔥 FINAL SCORE
    healthScore: {
      type: Number,
      default: 0
    },

    // 🔥 STREAK
    streak: {
      type: Number,
      default: 0
    }

  }, {

    timestamps: true

  });

export default mongoose.model(
  "HealthData",
  healthSchema
);