import { runLLM } from "./llmService.js";

export async function planResponse(message, memory, brainType) {
  const messages = [
    {
      role: "system",
      content: "Analyze the meeting progress and determine the best negotiation strategy to stay within the user's defined boundaries."
    },
    ...memory,
    { role: "user", content: message }
  ];

  const plan = await runLLM(messages, brainType);
  return plan;
}