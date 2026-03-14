import { runLLM } from "./llmService.js";

export async function generateNegotiationReply(personality, plan, message, memory) {

  const messages = [
    {
      role: "system",
      content: `
You are negotiating on behalf of the user.

Personality:
${personality}

Strategy:
${plan}

Respond naturally as the user.
`
    },
    ...memory,
    { role: "user", content: message }
  ];

  return await runLLM(messages)
}