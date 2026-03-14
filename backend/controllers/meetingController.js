import Agent from '../models/Agent.js';
import { runCloneAgent } from '../agent/cloneAgent.js'; // Ensure path is correct

export const handleMeetingChat = async (req, res) => {
  try {
    const { agentId, meetingId, message } = req.body;

    // 1. Get the Agent DNA from MongoDB
    const agentData = await Agent.findById(agentId);
    
    if (!agentData) {
      return res.status(404).json({ error: "Agent identity not found in database." });
    }

    // 2. Run the Multi-Agent Pipeline
    // This calls your planner, negotiator, and validator in order
    const aiResponse = await runCloneAgent(agentData, meetingId, message);

    // 3. Return the response to the UI
    res.status(200).json({
      success: true,
      data: aiResponse
    });

  } catch (error) {
    console.error("Negotiation Error:", error);
    res.status(500).json({ error: "Agent neural link failed." });
  }
};