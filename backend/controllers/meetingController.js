import Agent from '../models/Agent.js';
import Meeting from '../models/Meeting.js';
import { runCloneAgent } from '../agent/cloneAgent.js';

export const handleMeetingChat = async (req, res) => {
  try {
    const { agentId, roomId, message } = req.body;

    const meeting = await Meeting.findOne({ roomId });
    if (!meeting) {
      return res.status(404).json({ error: "Meeting room not found." });
    }

    const agentData = await Agent.findById(agentId);
    if (!agentData) {
      return res.status(404).json({ error: "Agent identity not found." });
    }

    // Save User Message
    meeting.messages.push({
      role: 'user',
      senderName: 'Counterparty',
      content: message,
      timestamp: new Date()
    });

    // Run the Multi-Agent Pipeline
    // We pass meeting.goal so the AI understands the specific context of this room
    const aiResponse = await runCloneAgent(agentData, meeting.goal, message, meeting.messages);

    // Save AI Response & Strategic Thought
    meeting.messages.push({
      role: 'assistant',
      senderName: agentData.name,
      content: aiResponse.response,
      thought: aiResponse.thought || aiResponse.plan, 
      timestamp: new Date()
    });

    await meeting.save();

    res.status(200).json({
      success: true,
      response: aiResponse.response,
      thought: aiResponse.thought || aiResponse.plan
    });

  } catch (error) {
    console.error("Negotiation Error:", error);
    res.status(500).json({ error: "Agent neural link failed." });
  }
};

export const initMeeting = async (req, res) => {


  try {

    console.log("start hi everyone");
    const { agentId } = req.params;
    const { counterpartyEmail, goal, ownerAddress, iqPool } = req.body;

    // 1. Validation check
    if (!goal || !counterpartyEmail) {
      return res.status(400).json({ error: "Missing goal or counterparty email." });
    }

    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();

    // 2. Safely fetch agent
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
      messages: [] // Explicitly initialize empty messages array
    });

    await newMeeting.save();

    res.status(201).json({ roomId, agentId });
  } catch (error) {
    console.error("Init Meeting Error:", error);
    res.status(500).json({ error: error.message });
  }
};