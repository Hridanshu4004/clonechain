import { buildPersonality } from "./personalityEngine.js";
import { checkDeal } from "./negotiationEngine.js";
import { planResponse } from "./plannerAgent.js";
import { generateNegotiationReply } from "./negotiatorAgent.js";
import { validateReply } from "./validatorAgent.js";
import { validateResponse } from "./responseValidator.js";

// Added 'goal' and 'history' to the parameters
export async function runCloneAgent(agentData, goal, message, history = []) {
  
  // 1. Hard Boundary Check (Lab Rules)
  const dealCheck = checkDeal(message, agentData);
  if (!dealCheck.allowed) {
    return {
      response: dealCheck.reply,
      thought: "Offer rejected: Message violates safety or price boundaries."
    };
  }

  // 2. Personality & Identity Setup
  const personality = buildPersonality(agentData);
  const brainType = agentData.brain;

  // 3. Strategic Planning
  // We pass the 'goal' so the planner knows what we're trying to achieve
  const plan = await planResponse(message, history, brainType, goal);

  // 4. Draft the Negotiation Reply
  const reply = await generateNegotiationReply(
    personality,
    plan,
    message,
    history,
    brainType,
    goal // Added goal here as well
  );

  // 5. Self-Correction / Validation
  const validation = await validateReply(reply, brainType);
  
  let finalReply = validateResponse(reply);

  if (validation !== "VALID" && validation.length > 5) {
    finalReply = validation;
  }

  // Return both the reply and the plan so the UI reasoning panel updates
  return {
    response: finalReply,
    thought: plan 
  };
}