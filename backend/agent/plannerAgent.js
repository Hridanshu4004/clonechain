import { runLLM } from "./llmService.js";

export async function planResponse(message, memory) {

  const messages = [
    {
      role: "system",
      content: "Analyze the user's message and determine the negotiation strategy."
    },
    ...memory,
    { role: "user", content: message }
  ];

  const plan = await runLLM(messages);

  return plan
}