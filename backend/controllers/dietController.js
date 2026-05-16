import redisClient from "../redisClient.js";
import fetch from "node-fetch";

import DietPlan from "../models/DietPlan.js";
import User from "../models/User.js";

console.log("🔥 CONTROLLER FILE RUNNING");

const CACHE_TIME = 60 * 15;

// 🔑 CACHE KEY
function getCacheKey(ingredients) {

  return ingredients
    .map(i => i.toLowerCase().trim())
    .filter(Boolean)
    .sort()
    .join("_");

}

// ⏳ DELAY
const delay = (ms) =>
  new Promise(res => setTimeout(res, ms));

// 🧵 REQUEST QUEUE
let activeRequests = 0;

const MAX_REQUESTS = 3;

async function waitForSlot() {

  while (activeRequests >= MAX_REQUESTS) {

    await delay(300);

  }

}

// 🤖 OPENROUTER
async function callOpenRouter(
  prompt,
  retries = 3
) {

  for (let i = 0; i < retries; i++) {

    try {

      console.log(
        "👉 Calling OpenRouter..."
      );

      const controller =
        new AbortController();

      const timeout =
        setTimeout(
          () => controller.abort(),
          20000
        );

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {

          method: "POST",

          headers: {

            Authorization:
              `Bearer ${process.env.OPENROUTER_API_KEY}`,

            "Content-Type":
              "application/json"

          },

          body: JSON.stringify({

            model:
              "openai/gpt-4o-mini",

            temperature: 0.9,

            messages: [

              {
                role: "system",

                content: `

You are an advanced AI Indian diet planner and nutrition expert.

Your job:

- Generate personalized healthy Indian meals.
- Meals must match the user's medical conditions.
- Use ONLY the ingredients provided.
- Give realistic calories and protein values.
- Explain the exact health benefits.
- Make responses premium quality and personalized.

STRICT RULES:

- Return STRICT JSON ONLY.
- No markdown.
- No explanation outside JSON.
- Do NOT invent ingredients not provided.
- Meals must be realistic.
- Calories must be accurate.
- Protein must be accurate.

`

              },

              {
                role: "user",
                content: prompt
              }

            ]

          }),

          signal: controller.signal

        }
      );

      clearTimeout(timeout);

      if (!response.ok) {

        const errText =
          await response.text();

        throw new Error(errText);

      }

      const data =
        await response.json();

      const text =
        data?.choices?.[0]
          ?.message?.content;

      if (!text)
        throw new Error(
          "Empty response"
        );

      return text;

    } catch (err) {

      console.log(
        `❌ Retry ${i + 1} failed`
      );

      await delay(
        1000 * (i + 1)
      );

      if (i === retries - 1)
        throw err;

    }

  }

}

// 🎯 MAIN CONTROLLER
export const generateDietPlan =
  async (req, res) => {

    const {
      ingredients,
      avoid = []
    } = req.body;

    if (
      !ingredients ||
      !Array.isArray(ingredients) ||
      ingredients.length === 0
    ) {

      return res.status(400).json({
        error:
          "No ingredients provided"
      });

    }

    const key =
      `diet:${getCacheKey([
        ...ingredients,
        ...avoid
      ])}`;

    try {

      // ✅ FETCH USER
      const user =
        await User.findById(
          req.user.id
        );

      const medicalConditions =
        user?.medicalConditions
          ?.join(", ")
        || "None";

      // ✅ CACHE CHECK
      try {

        const cached =
          await redisClient.get(key);

        if (cached) {

          console.log(
            "⚡ Cache Hit"
          );

          return res.json(
            JSON.parse(cached)
          );

        }

      } catch (err) {

        console.log(
          "⚠️ Redis read error:",
          err.message
        );

      }

      console.log("❌ Cache Miss");

      // ✅ REQUEST LIMIT
      await waitForSlot();

      activeRequests++;

      try {

        // 🔥 AI PROMPT
        const prompt = `

User Medical Conditions:
${medicalConditions}

Available Ingredients:
${ingredients.join(", ")}

Avoid Ingredients:
${avoid.join(", ") || "none"}

Generate a personalized Indian diet plan.

Use ONLY the available ingredients.

Return STRICT JSON ONLY.

Format:

{
  "breakfast": {
    "meal": "",
    "ingredients": [],
    "preparation": "",
    "calories": 0,
    "protein": 0,
    "healthBenefit": ""
  },

  "lunch": {
    "meal": "",
    "ingredients": [],
    "preparation": "",
    "calories": 0,
    "protein": 0,
    "healthBenefit": ""
  },

  "dinner": {
    "meal": "",
    "ingredients": [],
    "preparation": "",
    "calories": 0,
    "protein": 0,
    "healthBenefit": ""
  },

  "snacks": {
    "meal": "",
    "ingredients": [],
    "preparation": "",
    "calories": 0,
    "protein": 0,
    "healthBenefit": ""
  }
}

IMPORTANT:

- Give REALISTIC calorie values.
- Give REALISTIC protein values in grams.
- healthBenefit must explain:
  - why the meal is healthy
  - how it helps the user's condition
  - nutritional benefits
- Make the output premium quality.
- Avoid generic responses.
- Use proper Indian meals.

`;

        const text =
          await callOpenRouter(
            prompt
          );

        let json;

        // ✅ SAFE JSON PARSE
        try {

          json = JSON.parse(text);

        } catch {

          try {

            const match =
              text.match(
                /\{[\s\S]*\}/
              );

            json = JSON.parse(
              match[0]
            );

          } catch {

            throw new Error(
              "AI failed to generate valid JSON"
            );

          }

        }

        // ✅ CACHE SAVE
        try {

          await redisClient.set(
            key,
            JSON.stringify({
              success: true,
              diet_plan: json
            }),
            "EX",
            CACHE_TIME
          );

          console.log(
            "💾 Cache Saved"
          );

        } catch (err) {

          console.log(
            "⚠️ Redis write error:",
            err.message
          );

        }

        // ✅ SAVE MONGO
        try {

          await DietPlan.create({

            userId:
              req.user.id,

            ingredients,

            avoid,

            medicalConditions,

            plan: json

          });

          console.log(
            "💾 Saved to MongoDB"
          );

        } catch (err) {

          console.log(
            "⚠️ MongoDB error:",
            err.message
          );

        }

        return res.json({
          success: true,
          diet_plan: json
        });

      } finally {

        activeRequests--;

      }

    } catch (error) {

      console.error(
        "🔥 ERROR:",
        error
      );

      return res.status(500).json({

        error:
          "Failed to generate diet plan"

      });

    }

};

// 📜 HISTORY
export const getDietHistory =
  async (req, res) => {

    try {

      const data =
        await DietPlan.find({
          userId: req.user.id
        })
          .sort({
            createdAt: -1
          })
          .limit(10);

      res.json(data);

    } catch (error) {

      console.error(
        "❌ History Error:",
        error
      );

      res.status(500).json({
        error:
          "Failed to fetch history"
      });

    }

};