import { runLLM } from "./llmService.js";

export async function validateReply(reply) {

  const messages = [
    {
      role: "system",
      content: "Check if this response is logical and human sounding."
    },
    {
      role: "user",
      content: reply
    }
  ];

  const result = await runLLM(messages);

  return result
}