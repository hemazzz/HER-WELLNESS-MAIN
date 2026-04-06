export const chat = async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a helpful health assistant."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    const reply = data?.choices?.[0]?.message?.content || "No response";

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};