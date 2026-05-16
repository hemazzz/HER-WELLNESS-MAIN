import HealthData from "../models/HealthData.js";
import User from "../models/User.js";

import {
  calculateHealthScore
} from "../utils/healthScore.js";

// 🔥 STREAK
const calculateStreak = (
  dataList
) => {

  let streak = 0;

  for (
    let i = dataList.length - 1;
    i >= 0;
    i--
  ) {

    if (
      dataList[i].healthScore >= 60
    ) {

      streak++;

    } else {

      break;

    }

  }

  return streak;

};

// 🔥 DYNAMIC AI INSIGHTS
const generateInsight = (
  data,
  medicalConditions
) => {

  const insights = [];

  // 😴 SLEEP
  if (data.sleepHours < 6) {

    insights.push(
      "😴 Your sleep is low. Better sleep improves hormonal and mental wellness."
    );

  }

  // 💧 WATER
  if (data.waterIntake < 5) {

    insights.push(
      "💧 Increase hydration for better metabolism and energy."
    );

  }

  // 🚶 STEPS
  if (data.stepsWalked < 4000) {

    insights.push(
      "🚶 Daily walking improves fitness and overall health."
    );

  }

  // 🧘 STRESS
  if (data.stressLevel > 7) {

    insights.push(
      "🧘 High stress detected. Meditation and relaxation may help."
    );

  }

  // 🥗 DIET
  if (data.dietQuality < 5) {

    insights.push(
      "🥗 Improve meal quality with balanced nutrition and protein-rich foods."
    );

  }

  // 🔥 KCAL + PROTEIN INSIGHTS
  if (data.calories > 0) {

    insights.push(
      `🔥 Today's calorie intake is ${data.calories} kcal.`
    );

  }

  if (data.protein > 0) {

    insights.push(
      `💪 Protein intake is ${data.protein}g which helps muscle and hormone health.`
    );

  }

  // 🌸 CONDITION INSIGHTS
  medicalConditions.forEach(
    (condition) => {

      insights.push(

        `🌸 Health focus for ${condition}: maintain proper sleep, balanced nutrition, hydration, stress management, and regular physical activity.`

      );

    }
  );

  // ✨ DEFAULT
  if (insights.length === 0) {

    insights.push(
      "✨ Your health looks balanced today. Keep maintaining healthy habits."
    );

  }

  return insights;

};

// 🔥 ADD HEALTH DATA
export const addHealthData =
  async (req, res) => {

    try {

      const body = req.body;

      // 🔥 GET USER
      const user =
        await User.findById(
          req.user.id
        );

      const medicalConditions =
        user?.medicalConditions
        || [];

      // 🔥 HEALTH SCORE
      const healthScore =
        calculateHealthScore(
          body
        );

      // 🔥 USE REAL VALUES FROM DIET PLAN
      const calories =
        Number(body.calories) || 0;

      const protein =
        Number(body.protein) || 0;

      // 🔥 AI INSIGHTS
      const insights =
        generateInsight(
          {
            ...body,
            calories,
            protein
          },
          medicalConditions
        );

      // 🔥 SAVE DATA
      const newData =
        new HealthData({

          ...body,

          userId:
            req.user.id,

          healthScore,

          insights,

          calories,

          protein

        });

      await newData.save();

      // 🔥 FETCH USER DATA
      const allData =
        await HealthData.find({

          userId:
            req.user.id

        }).sort({
          date: 1
        });

      // 🔥 STREAK
      const streak =
        calculateStreak(
          allData
        );

      res.json({

        success: true,

        newData,

        streak,

        insights,

        calories,

        protein

      });

    } catch (err) {

      console.log(err);

      res.status(500).json({

        error:
          err.message

      });

    }

};

// 🔥 GET USER DATA
export const getHealthData =
  async (req, res) => {

    try {

      const data =
        await HealthData.find({

          userId:
            req.user.id

        }).sort({
          createdAt: 1
        });

      res.json(data);

    } catch (err) {

      res.status(500).json({

        error:
          err.message

      });

    }

};

// 🔥 WEEKLY STATS
export const getWeeklyStats =
  async (req, res) => {

    try {

      const data =
        await HealthData.find({

          userId:
            req.user.id

        }).sort({
          createdAt: 1
        });

      const lastWeek =
        data.slice(-14, -7);

      const thisWeek =
        data.slice(-7);

      const avg = (arr) =>

        arr.length

          ? arr.reduce(
              (a, b) =>
                a + b.healthScore,
              0
            ) / arr.length

          : 0;

      const prevWeekScore =
        Math.round(
          avg(lastWeek)
        );

      const currWeekScore =
        Math.round(
          avg(thisWeek)
        );

      res.json({

        prevWeekScore,

        currWeekScore,

        improvement:
          currWeekScore -
          prevWeekScore

      });

    } catch (err) {

      res.status(500).json({

        error:
          err.message

      });

    }

};