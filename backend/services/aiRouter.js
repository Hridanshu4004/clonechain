import { generateLlamaResponse } from "./llamaService.js";
import { negotiateOffer } from "../agent/negotiationEngine.js";

export async function runAI(model, prompt) {
  if (model === "llama") {
    return await generateLlamaResponse(prompt);
  }

  return "Invalid model selected";
}

export async function handleAIMessage(message, agentData = {}) {
  // Route messages to negotiation engine
  return await negotiateOffer(message, agentData);
}

export async function processNegotiation(message, agentData = {}) {
  // Alias for handleAIMessage - routes to negotiation engine
  return await negotiateOffer(message, agentData);
}
