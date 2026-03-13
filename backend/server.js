const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CloneChain Backend Running 🚀");
});

app.post("/agent/chat", async (req, res) => {
  const { message, meetingId } = req.body;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt: message,
        stream: false,
      }),
    });

    const data = await response.json();
    res.json({ reply: data.response });
  } catch (error) {
    res.status(500).json({ error: "Ollama not reachable" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});