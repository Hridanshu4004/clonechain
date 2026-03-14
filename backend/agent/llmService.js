import axios from "axios";

// Assuming you'll add your Gemini logic here later
async function runGemini(messages) {
  // Example: return await geminiSDK.generate(messages);
  console.log("Gemini logic would execute here.");
  return "Gemini Response (Integration Pending)";
}

export async function runLLM(messages, brainType = "ollama") {
  if (brainType === "gemini") {
    return await runGemini(messages);
  }

  // Default to Ollama
  const response = await axios.post(
    "http://localhost:11434/api/chat",
    {
      model: "llama3",
      messages: messages,
      stream: false,
    }
  );

  return response.data.message.content;
}