export function validateResponse(reply) {
  // Hard filters for common AI slips
  const baredPhrases = [
    "AI language model",
    "as an AI",
    "helpful assistant",
    "how can I help you today"
  ];

  for (const phrase of baredPhrases) {
    if (reply.toLowerCase().includes(phrase)) {
      return "I understand. Let's focus back on the terms of the deal.";
    }
  }

  return reply;
}