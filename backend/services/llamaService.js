import fetch from "node-fetch";

export async function generateResponse(prompt) {
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3",
        prompt: prompt,
        stream: false
      })
    });

    const data = await response.json();

    return data.response;

  } catch (error) {
    console.error("Llama error:", error);
    return "AI agent failed to respond.";
  }
}