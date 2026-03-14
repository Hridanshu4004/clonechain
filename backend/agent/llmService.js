import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import 'dotenv/config'; // Ensures API keys are read

// Initialize OpenAI client if API key is present
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

// Only initialize Gemini if the API key is present
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

async function runGeminiWithUsage(messages) {
  if (!genAI) {
    console.warn("Gemini API key missing. Falling back to Ollama.");
    return null; // Let runLLMWithUsage handle the fallback
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Map your roles to Gemini's specific roles ('user' and 'model')
    const chat = model.startChat({
      history: messages.slice(0, -1).map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content || m.message }], // Supports both 'content' or 'message' field
      })),
    });

    const lastMessage = messages[messages.length - 1].content || messages[messages.length - 1].message;
    const result = await chat.sendMessage(lastMessage);

    const text = await result.response.text();
    const tokens = result?.usage?.totalTokens ?? result?.usage?.tokenCount ?? 0;

    return { text, tokens };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "Error: Gemini neural link failed.", tokens: 0 };
  }
}

async function runOpenAIWithUsage(messages) {
  if (!openai) {
    console.warn("OpenAI API key missing. Falling back to Ollama.");
    return null;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages.map(m => ({
        role: m.role,
        content: m.content || m.message
      })),
      temperature: 0.7,
      max_tokens: 1000
    });

    const text = response.choices[0].message.content;
    const tokens = response.usage?.total_tokens ?? 0;

    return { text, tokens };
  } catch (error) {
    console.error("OpenAI Error:", error);
    return { text: "Error: OpenAI connection failed.", tokens: 0 };
  }
}

async function runOllamaWithUsage(messages) {
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

    const text = response.data?.message?.content || "";
    const tokens = response.data?.usage?.total_tokens ?? response.data?.usage?.totalTokens ?? response.data?.usage?.token_count ?? 0;
    return { text, tokens };
  } catch (error) {
    console.error("Ollama Error:", error);
    return { text: "I'm having trouble connecting to my local brain (Ollama). Is the service running?", tokens: 0 };
  }
}

export async function runLLMWithUsage(messages, brainType = "ollama") {
  // If explicitly asked for OpenAI AND the key exists, run it
  if (brainType === "openai" && openai) {
    const openaiResult = await runOpenAIWithUsage(messages);
    if (openaiResult) return openaiResult;
  }

  // If explicitly asked for Gemini AND the key exists, run it
  if (brainType === "gemini" && genAI) {
    const geminiResult = await runGeminiWithUsage(messages);
    if (geminiResult) return geminiResult;
  }

  // Default / Fallback to Ollama
  return await runOllamaWithUsage(messages);
}

export async function runLLM(messages, brainType = "ollama") {
  const result = await runLLMWithUsage(messages, brainType);
  return result?.text || "";
}