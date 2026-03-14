import { runLLM } from "./llmService.js";

export async function generateNegotiationReply(personality, plan, message, memory, brainType) {
  const messages = [
    {
      role: "system",
      content: `
You are negotiating on behalf of the user.

Personality Profile:
${personality}

Current Strategy:
${plan}

Respond naturally and briefly.
`
    },
    ...memory,
    { role: "user", content: message }
  ];

  return await runLLM(messages, brainType);
}