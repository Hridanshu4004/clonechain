import { runLLMWithUsage } from "./llmService.js";

// Added 'goal' parameter
export async function generateNegotiationReply(personality, plan, message, memory, brainType, goal) {
  const messages = [
    {
      role: "system",
      content: `
You are negotiating on behalf of a user. 
The objective of this specific meeting is: "${goal}"

Personality Profile:
${personality}

Current Strategic Plan:
${plan}

Respond naturally and briefly. Your primary focus is achieving the goal while staying within your personality constraints.
`
    },
    ...memory,
    { role: "user", content: message }
  ];

  return await runLLMWithUsage(messages, brainType);
}