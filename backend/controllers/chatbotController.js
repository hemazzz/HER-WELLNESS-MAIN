import User from "../models/User.js";

export const chat = async (req, res) => {

  const { message } = req.body;

  try {

    // 🔥 GET USER
    const user = await User.findById(req.user.id);

    // 🔥 USER DETAILS
    const medicalConditions =
      user?.medicalConditions?.join(", ")
      || "None";

    const age =
      user?.age || "Not provided";

    const weight =
      user?.weight || "Not provided";

    const height =
      user?.height || "Not provided";

    const allergies =
      user?.allergies || "None";

    const cycleLength =
      user?.cycleLength || "Not provided";

    const lastPeriodDate =
      user?.lastPeriodDate || "Not provided";

    // 🔥 OPENROUTER AI
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {

        method: "POST",

        headers: {

          Authorization:
            `Bearer ${process.env.OPENROUTER_API_KEY}`,

          "Content-Type":
            "application/json",

        },

        body: JSON.stringify({

          model: "deepseek/deepseek-chat",

          temperature: 0.8,

          max_tokens: 500,

          messages: [

            // 🔥 SYSTEM PROMPT
            {
              role: "system",

              content: `

You are Her Wellness AI 🌸

You are a premium AI women's health assistant.

You give:
- personalized wellness advice
- thyroid support
- PCOS guidance
- anemia support
- period care
- hormonal health tips
- diet recommendations
- sleep guidance
- mental wellness support
- exercise recommendations

-----------------------------------
USER PROFILE
-----------------------------------

Age: ${age}
Weight: ${weight} kg
Height: ${height} cm
Medical Conditions: ${medicalConditions}
Allergies: ${allergies}
Cycle Length: ${cycleLength}
Last Period Date: ${lastPeriodDate}

-----------------------------------
RULES
-----------------------------------

1. Give natural human-like answers.
2. Personalize responses based on medical conditions.
3. Never give generic repetitive replies.
4. Keep answers medium-length.
5. Give practical health advice.
6. Suggest healthy foods and workouts.
7. Be friendly and supportive.
8. Use emojis sometimes.
9. Focus on women's wellness.
10. If user has thyroid,
    give thyroid-specific tips.
11. If user has PCOS,
    give hormonal balance advice.
12. If user has anemia,
    suggest iron-rich foods.

-----------------------------------
IMPORTANT
-----------------------------------

- Never say "consult doctor" repeatedly.
- Never sound robotic.
- Always answer intelligently.
- Make the conversation feel premium.

`
            },

            // 🔥 USER MESSAGE
            {
              role: "user",
              content: message
            }

          ]

        })

      }
    );

    const data = await response.json();

    console.log(
      "OPENROUTER RESPONSE:",
      data
    );

    const reply =
      data?.choices?.[0]?.message?.content
      || "Sorry, I couldn't respond properly.";

    res.json({
      success: true,
      reply
    });

  } catch (error) {

    console.error(
      "CHATBOT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      error: "Something went wrong"
    });

  }

};