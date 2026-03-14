import { runLLM } from "./llmService.js";

export async function validateReply(reply, brainType) {
  const messages = [
    {
      role: "system",
      content: "Check if this response is logical, stays in character, and sounds like a human. Respond 'VALID' if okay, or provide a corrected version."
    },
    {
      role: "user",
      content: reply
    }
  ];

  const result = await runLLM(messages, brainType);
  return result;
}