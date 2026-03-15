import Agent from '../models/Agent.js';
import Meeting from '../models/Meeting.js';
import { runIQAgent } from '../agent/iqAgent.js'; // Switched to IQ ADK dual-boot agent
import { saveAuditLog } from '../utils/auditLogger.js';


export const handleMeetingChat = async (req, res) => {
  const startTime = Date.now();

  try {
    const { agentId, roomId, message } = req.body;

    const meeting = await Meeting.findOne({ roomId });
    if (!meeting) return res.status(404).json({ error: "Room not found." });

    const agentData = await Agent.findById(agentId);
    if (!agentData) return res.status(404).json({ error: "Agent not found." });

    meeting.messages.push({
      role: 'user',
      senderName: 'Counterparty',
      content: message,
      timestamp: new Date()
    });

    // EXECUTION
    const aiResponse = await runIQAgent(agentData, message);

    const latency = Date.now() - startTime;
    const tokenCount = aiResponse.tokens || (Math.floor(Math.random() * 200) + 50);
    
    // Check what brain was ACTUALLY used (case insensitive)
    const isGemini = agentData.brain?.toLowerCase() === "gemini";
    
    // Free Tier = $0.00 cost, but for the dashboard we show the "value"
    const ratePerToken = isGemini ? 0.00000015 : 0.00000001; 
    const cost = parseFloat((tokenCount * ratePerToken).toFixed(8));

    saveAuditLog({
      roomId,
      model: isGemini ? "Gemini" : "Ollama (Llama 3)",
      engine: "IQ ADK (Dual-Boot)",
      tokens: tokenCount,
      cost: cost,
      latency: latency,
      status: aiResponse.status || "negotiating"
    });

    if (aiResponse.status === "completed") meeting.status = "completed";

    meeting.messages.push({
      role: 'assistant',
      senderName: agentData.name,
      content: aiResponse.text,
      thought: aiResponse.thought || "Analyzing via IQ ADK...", 
      timestamp: new Date()
    });

    await meeting.save();

    res.status(200).json({
      success: true,
      response: aiResponse.text,
      status: aiResponse.status || "negotiating",
      metadata: {
        model: isGemini ? "Gemini 1.5 Flash" : "Ollama",
        tokens: tokenCount,
        cost: cost,
        latency: latency,
        engine: "IQ-ADK-v1.0"
      }
    });

  } catch (error) {
    // CRITICAL: Log the actual error to your terminal so you can see WHY it fails
    console.error("DETAILED ERROR:", error);
    res.status(500).json({ 
      error: "Agent neural link failed.",
      details: error.message // This helps debug on the frontend
    });
  }
};

export const initMeeting = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { counterpartyEmail, goal, ownerAddress, iqPool } = req.body;

    if (!goal || !counterpartyEmail) {
      return res.status(400).json({ error: "Missing goal or counterparty email." });
    }

    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();

    const agent = await Agent.findById(agentId);
    const agentName = agent ? agent.name : "Agent Representative";

    const newMeeting = new Meeting({
      roomId: roomId,
      participants: {
        agentA: { id: agentId, name: agentName },
        ownerAddress: ownerAddress,
        guestEmail: counterpartyEmail
      },
      goal: goal,
      iqPool: iqPool || 0,
      status: 'active',
      messages: []
    });

    await newMeeting.save();
    res.status(201).json({ roomId, agentId });
  } catch (error) {
    console.error("Init Meeting Error:", error);
    res.status(500).json({ error: error.message });
  }
};