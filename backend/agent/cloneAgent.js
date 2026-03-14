import { buildPersonality } from "./personalityEngine.js";
import { checkDeal } from "./negotiationEngine.js";
import { getConversation, saveMessage } from "./memoryManager.js";
import { planResponse } from "./plannerAgent.js";
import { generateNegotiationReply } from "./negotiatorAgent.js";
import { validateReply } from "./validatorAgent.js";
import { validateResponse } from "./responseValidator.js";

export async function runCloneAgent(agentData, meetingId, message) {
  // 1. Check if message violates the hard boundaries set in the Lab
  const dealCheck = checkDeal(message, agentData);
  if (!dealCheck.allowed) {
    return dealCheck.reply;
  }

  // 2. Build the personality from DB rules
  const personality = buildPersonality(agentData);

  // 3. Get history
  const memory = getConversation(meetingId);

  // 4. Pass the specific brain (ollama/gemini) to all agents
  const brainType = agentData.brain;

  const plan = await planResponse(message, memory, brainType);

  const reply = await generateNegotiationReply(
    personality,
    plan,
    message,
    memory,
    brainType
  );

  const validation = await validateReply(reply, brainType);
  
  // Final cleanup of AI-isms
  let finalReply = validateResponse(reply);

  if (validation !== "VALID" && validation.length > 5) {
    finalReply = validation;
  }

  saveMessage(meetingId, "user", message);
  saveMessage(meetingId, "assistant", finalReply);

  return finalReply;
}