import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const test = async () => {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: "user", content: "Hello" }
      ]
    })
  });

  const data = await res.json();
  console.log(data);
};

test();