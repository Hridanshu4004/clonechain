import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config'; // Ensures process.env.GEMINI_API_KEY is read

// Only initialize Gemini if the API key is present
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

async function runGemini(messages) {
  if (!genAI) {
    console.warn("Gemini API key missing. Falling back to Ollama.");
    return null; // Let runLLM handle the fallback
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Map your roles to Gemini's specific expected roles ('user' and 'model')
    const chat = model.startChat({
      history: messages.slice(0, -1).map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content || m.message }], // Supports both 'content' or 'message' field
      })),
    });

    const lastMessage = messages[messages.length - 1].content || messages[messages.length - 1].message;
    const result = await chat.sendMessage(lastMessage);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error: Gemini neural link failed.";
  }
}

export async function runLLM(messages, brainType = "ollama") {
  // If explicitly asked for Gemini AND the key exists, run it
  if (brainType === "gemini" && genAI) {
    const geminiResult = await runGemini(messages);
    if (geminiResult) return geminiResult;
  }

  // Default / Fallback to Ollama
  try {
    const response = await axios.post(
      "http://localhost:11434/api/chat",
      {
        model: "llama3", // Ensure you have llama3 pulled in Ollama
        messages: messages.map(m => ({
          role: m.role,
          content: m.content || m.message // Normalize field names for Ollama
        })),
        stream: false,
      }
    );

    return response.data.message.content;
  } catch (error) {
    console.error("Ollama Error:", error);
    return "I'm having trouble connecting to my local brain (Ollama). Is the service running?";
  }
}