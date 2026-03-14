export function validateResponse(reply) {

  if (reply.includes("AI language model")) {
    return "Let me clarify my position.";
  }

  return reply
}