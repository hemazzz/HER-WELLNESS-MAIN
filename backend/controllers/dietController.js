import redisClient from "../redisClient.js";
import fetch from "node-fetch";
import DietPlan from "../models/DietPlan.js";

console.log("🔥 CONTROLLER FILE RUNNING");

const CACHE_TIME = 60 * 15;

// 🔑 Cache Key
function getCacheKey(ingredients) {
  return ingredients
    .map(i => i.toLowerCase().trim())
    .filter(Boolean)
    .sort()
    .join("_");
}

// ⏳ Delay
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// 🤖 OpenRouter Call
async function callOpenRouter(prompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log("👉 Calling OpenRouter...");

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5000",
            "X-Title": "diet-app"
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are a professional Indian diet planner. Always return strict JSON."
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
        const errText = await response.text();
        console.error("❌ OpenRouter ERROR:", errText);
        throw new Error("API Error");
      }

      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content;

      if (!text) throw new Error("Empty response");

      return text;

    } catch (err) {
      console.log(`❌ Retry ${i + 1} failed`);
      await delay(1000 * (i + 1));
      if (i === retries - 1) throw err;
    }
  }
}

// 🧵 Queue
let activeRequests = 0;
const MAX_REQUESTS = 3;

async function waitForSlot() {
  while (activeRequests >= MAX_REQUESTS) {
    await delay(300);
  }
}

// 🎯 MAIN CONTROLLER
export const generateDietPlan = async (req, res) => {
  const { ingredients, avoid = [] } = req.body;

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ error: "No ingredients provided" });
  }

  const key = `diet:${getCacheKey([...ingredients, ...avoid])}`;

  try {
    console.log("❌ Cache Miss");

    await waitForSlot();
    activeRequests++;

    try {
      const prompt = `
You are a professional Indian diet planner.

Available ingredients:
${ingredients.join(", ")}

Avoid ingredients:
${avoid.join(", ") || "none"}

Rules:
- Do NOT include avoided ingredients
- Create proper dishes (not raw items)
- Include calories, protein, carbs
- Meals should be realistic Indian food

IMPORTANT:
Return ONLY JSON.

FORMAT:
{
  "breakfast": [
    { "name": "Egg Omelette", "calories": 200, "protein": 12, "carbs": 2 }
  ],
  "lunch": [...],
  "dinner": [...],
  "snacks": [...]
}
`;

      const text = await callOpenRouter(prompt);

      console.log("🤖 RAW AI RESPONSE:", text);

      let json;

      try {
        json = JSON.parse(text);
      } catch {
        try {
          const match = text.match(/\{[\s\S]*\}/);
          if (!match) throw new Error("No JSON");
          json = JSON.parse(match[0]);
        } catch (err) {
          console.error("❌ JSON Parse Error:", err);

          // 🔥 FIXED FALLBACK
          json = {
            breakfast: [
              { name: "Milk", calories: 120, protein: 6, carbs: 10 }
            ],
            lunch: [
              { name: "Rice", calories: 200, protein: 4, carbs: 45 }
            ],
            dinner: [
              { name: "Chapati", calories: 150, protein: 5, carbs: 30 }
            ],
            snacks: [
              { name: "Fruits", calories: 100, protein: 1, carbs: 25 }
            ]
          };
        }
      }

      // 💾 CACHE
      try {
        await redisClient.set(key, JSON.stringify(json));
        await redisClient.expire(key, CACHE_TIME);
        console.log("💾 Cache Saved");
      } catch (err) {
        console.log("⚠️ Redis error:", err.message);
      }

      // 💾 MONGO
      try {
        await DietPlan.create({
          userId: "demoUser",
          ingredients,
          avoid,
          plan: json
        });
        console.log("💾 Saved to MongoDB");
      } catch (err) {
        console.log("⚠️ MongoDB error:", err.message);
      }

      return res.json(json);

    } finally {
      activeRequests--;
    }

  } catch (error) {
    console.error("🔥 ERROR:", error);
    return res.status(500).json({
      error: "Failed to generate diet plan"
    });
  }
};


// 📜 HISTORY
export const getDietHistory = async (req, res) => {
  try {
    const data = await DietPlan.find()
      .sort({ createdAt: -1 })
      .limit(7);

    res.json(data);
  } catch (error) {
    console.error("❌ History Error:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};