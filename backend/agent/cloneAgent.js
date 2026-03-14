import { buildPersonality } from "./personalityEngine.js";
import { checkDeal } from "./negotiationEngine.js";
import { planResponse } from "./plannerAgent.js";
import { generateNegotiationReply } from "./negotiatorAgent.js";
import { validateReply } from "./validatorAgent.js";
import { validateResponse } from "./responseValidator.js";

export async function runCloneAgent(agentData, goal, message, history = []) {
  
  // 1. Hard Boundary Check
  const dealCheck = checkDeal(message, agentData);
  if (!dealCheck.allowed) {
    return {
      response: dealCheck.reply,
      thought: "Offer rejected: Message violates safety or price boundaries.",
      status: "negotiating" // Keep negotiating if an offer is simply blocked
    };
  }

  // 2. Personality & Identity Setup
  const personality = buildPersonality(agentData);
  const brainType = agentData.brain;

  // 3. Strategic Planning
  const plan = await planResponse(message, history, brainType, goal);

  // 4. Draft the Negotiation Reply
  const { text: replyText, tokens: replyTokens = 0 } = await generateNegotiationReply(
    personality,
    plan,
    message,
    history,
    brainType,
    goal
  );

  // 5. Self-Correction / Validation & Status Detection
  const validationResult = await validateReply(replyText, brainType);
  
  // Parse the status and the actual text (looking for our STATUS: prefix)
  let status = "negotiating";
  let finalReply = replyText;

  if (validationResult.includes("STATUS:COMPLETED")) {
    status = "completed";
    finalReply = validationResult.split("|")[1]?.trim() || reply;
  } else if (validationResult.includes("STATUS:NEGOTIATING")) {
    status = "negotiating";
    finalReply = validationResult.split("|")[1]?.trim() || reply;
  }

  // Run through hard-coded AI slip filters
  finalReply = validateResponse(finalReply);

  // Return the status to the controller
  return {
    response: finalReply,
    thought: plan,
    status: status,
    tokens: replyTokens
  };
}