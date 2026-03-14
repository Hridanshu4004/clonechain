const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function negotiate(offer) {
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: `You are a negotiation AI agent. 
    A buyer offers ${offer} IQ for a product.
    Respond with accept, reject, or counter offer with reasoning.`,
  });

  return response.output_text;
}

module.exports = { negotiate };
