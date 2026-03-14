import { runLLM } from "./llmService.js";

export async function validateReply(reply, brainType) {
  const messages = [
    {
      role: "system",
      content: `
      Review the AI's response. 
      1. If the response indicates a final agreement (e.g., "Deal", "I accept", "Agreed", "Terms accepted"), respond with exactly: STATUS:COMPLETED | [Original Reply]
      2. If the negotiation is still ongoing, respond with exactly: STATUS:NEGOTIATING | [Original Reply]
      
      Sound like a human. If the response is nonsensical, correct it, but always keep the STATUS prefix.
      `
    },
    {
      role: "user",
      content: reply
    }
  ];

  const result = await runLLM(messages, brainType);
  return result;
}