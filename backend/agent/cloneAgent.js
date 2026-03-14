import { buildPersonality } from "./personalityEngine.js";
import { checkDeal } from "./negotiationEngine.js";
import { getConversation, saveMessage } from "./memoryManager.js";

import { planResponse } from "./plannerAgent.js";
import { generateNegotiationReply } from "./negotiatorAgent.js";
import { validateReply } from "./validatorAgent.js";
import { validateResponse } from "./responseValidator.js";

export async function runCloneAgent(userProfile, meetingId, message) {

  const dealCheck = checkDeal(message, userProfile);

  if (!dealCheck.allowed) {
    return dealCheck.reply;
  }

  const personality = buildPersonality(userProfile);

  const memory = getConversation(meetingId);

  const plan = await planResponse(message, memory);

  const reply = await generateNegotiationReply(
    personality,
    plan,
    message,
    memory
  );

  const validation = await validateReply(reply);
  const cleanReply = validateResponse(reply);

  let finalReply = reply;

  if (validation !== "VALID") {
    finalReply = validation;
  }

  saveMessage(meetingId, "user", message);
  saveMessage(meetingId, "assistant", finalReply);

  return finalReply;
}
