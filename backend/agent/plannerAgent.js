import { runLLM } from "./llmService.js";

// Added 'goal' parameter
export async function planResponse(message, memory, brainType, goal) {
  const messages = [
    {
      role: "system",
      content: `
Analyze the meeting progress. 
Your specific objective for this meeting is: "${goal}"

Based on the conversation history and the user's latest message, determine the best next step.
Should you concede slightly, hold firm, or propose a counter-offer to reach the goal?
Keep the plan brief and strategic.
`
    },
    ...memory,
    { role: "user", content: message }
  ];

  const plan = await runLLM(messages, brainType);
  return plan;
}