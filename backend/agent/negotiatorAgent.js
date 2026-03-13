import { runLLM } from "./llmService.js";

export async function generateNegotiationReply(personality, plan, message, memory) {

  const messages = [
    {
      role: "system",
      content: `
You are an AI clone representing the user.

Follow this personality:
${personality}

Negotiation strategy:
${plan}

Respond naturally as the user would.
`
    },
    ...memory,
    { role: "user", content: message }
  ];

  const reply = await runLLM(messages);

  return reply;
}