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