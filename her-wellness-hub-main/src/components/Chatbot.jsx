import { useState } from "react";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    setChat((prev) => [
      ...prev,
      { sender: "user", text: userMessage }
    ]);

    setMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      let aiReply = "";
      const lowerMessage = userMessage.toLowerCase();

      if (lowerMessage.includes("period")) {
        aiReply =
          "Periods usually happen every 28 to 35 days. Stay hydrated and track your cycle regularly.";
      } else if (lowerMessage.includes("diet")) {
        aiReply =
          "A balanced diet should include fruits, vegetables, protein, milk, and plenty of water.";
      } else if (lowerMessage.includes("stress")) {
        aiReply =
          "Try deep breathing, walking, meditation, or listening to music to reduce stress.";
      } else if (lowerMessage.includes("sleep")) {
        aiReply =
          "Aim for 7 to 8 hours of sleep every night for better health and energy.";
      } else if (lowerMessage.includes("exercise")) {
        aiReply =
          "Regular walking, yoga, stretching, and light exercise can improve overall wellness.";
      } else {
        aiReply =
          "I am here to help with wellness, diet, sleep, stress, exercise, and period-related questions.";
      }

      setChat((prev) => [
        ...prev,
        { sender: "ai", text: aiReply }
      ]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        { sender: "ai", text: "Something went wrong. Please try again." }
      ]);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "20px" }}>Her Wellness Chat 💖</h2>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "15px",
          minHeight: "300px",
          marginBottom: "20px",
          backgroundColor: "#fafafa"
        }}
      >
        {chat.length === 0 ? (
          <p style={{ color: "#777" }}>
            Start chatting with your wellness assistant...
          </p>
        ) : (
          chat.map((msg, index) => (
            <div
              key={index}
              style={{
                marginBottom: "12px",
                textAlign: msg.sender === "user" ? "right" : "left"
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  backgroundColor:
                    msg.sender === "user" ? "#ec4899" : "#f3f4f6",
                  color: msg.sender === "user" ? "#fff" : "#111",
                  maxWidth: "80%"
                }}
              >
                {msg.text}
              </span>
            </div>
          ))
        )}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask your health question..."
          style={{
            flex: 1,
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "10px"
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "12px 18px",
            backgroundColor: "#ec4899",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;