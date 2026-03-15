// backend/agent/iqAgent.js
import { AgentBuilder } from "@iqai/adk";

export async function runIQAgent(agentData, message) {
  try {
    const isGemini = agentData.brain?.toLowerCase().trim() === "gemini";
    
    
    const modelId = isGemini ? "gemini-2.5-flash" : "llama3";

    const { runner } = await AgentBuilder.create(agentData.name || "negotiator")
      .withModel(modelId)
      .withInstruction(`
        Identity: ${agentData.name}
        Strategy: ${agentData.decisionLogic}
        Price Range: ${agentData.lowerBoundary} to ${agentData.upperBoundary}
        Rules: ${agentData.customRules}
      `)
      .build({
        googleApiKey: process.env.GOOGLE_API_KEY,
        provider: isGemini ? "google" : "ollama"
      });

    const response = await runner.ask(message);

    return {
      text: typeof response === 'string' ? response : (response.content || ""),
      tokens: response.usage?.totalTokens || 0,
      brainUsed: isGemini ? "Gemini 2.5" : "Ollama",
      status: "negotiating" 
    };
  } catch (error) {
    console.error("ADK Final Step Error:", error);
    throw error;
  }
}