import { runLLM } from "./llmService.js";

export async function negotiateOffer(message, agentData) {
  // Extract offer amount
  const priceMatch = message.match(/\d+/);
  const offer = priceMatch ? parseInt(priceMatch[0]) : 0;
  
  // Extract boundaries from agentData
  const minLimit = parseInt(agentData.lowerBoundary.replace(/\D/g, "")) || 500;
  const maxLimit = parseInt(agentData.upperBoundary.replace(/\D/g, "")) || 5000;

  // Build Llama prompt
  const prompt = `
You are an AI negotiation agent for the CloneChain platform.

Agent Personality: ${agentData.personality || "Professional and strategic"}
Agent Name: ${agentData.name || "Agent"}

Negotiation Rules:
- Reject offers below ${minLimit} IQ tokens
- Accept offers between ${minLimit} and ${maxLimit} IQ tokens
- Maximum negotiation rounds: 5
- Be professional and respectful

User Offer: ${offer} IQ tokens
Original Message: "${message}"

Respond with:
1. Decision (ACCEPT/REJECT/COUNTER)
2. Reasoning
3. Counter-offer if applicable (if COUNTER)

Keep your response concise and aligned with the agent's personality.
`;

  try {
    const response = await runLLM([
      {
        role: "user",
        content: prompt
      }
    ]);

    return {
      success: true,
      decision: extractDecision(response),
      message: response,
      offer: offer
    };
  } catch (error) {
    console.error("Negotiation Engine Error:", error);
    return {
      success: false,
      decision: "ERROR",
      message: "Negotiation engine encountered an error. Please try again."
    };
  }
}

function extractDecision(response) {
  const upperResponse = response.toUpperCase();
  if (upperResponse.includes("ACCEPT")) return "ACCEPT";
  if (upperResponse.includes("REJECT")) return "REJECT";
  if (upperResponse.includes("COUNTER")) return "COUNTER";
  return "UNKNOWN";
}

// Legacy function for backward compatibility
export function checkDeal(message, agentData) {
  // Look for any numbers representing IQ or currency
  const priceMatch = message.match(/\d+/);
  
  if (priceMatch) {
    const price = parseInt(priceMatch[0]);
    // Extract numbers from the boundary strings (e.g., "500 IQ" -> 500)
    const minLimit = parseInt(agentData.lowerBoundary.replace(/\D/g, "")) || 0;
    const maxLimit = parseInt(agentData.upperBoundary.replace(/\D/g, "")) || Infinity;

    // If the offer is below the minimum boundary set in the Lab
    if (price < minLimit) {
      return {
        allowed: false,
        reply: `I cannot accept that. My minimum threshold is ${minLimit}. we need to do better.`
      };
    }
  }

  return { allowed: true };
}