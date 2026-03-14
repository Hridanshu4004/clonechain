import Agent from '../models/Agent.js';
import { runCloneAgent } from '../agent/cloneAgent.js';
import Meeting from '../models/Meeting.js'; // Added this


export const handleMeetingChat = async (req, res) => {
  try {
    const { agentId, roomId, message } = req.body; // Using roomId to match your frontend

    // 1. Fetch Meeting Context
    const meeting = await Meeting.findOne({ roomId });
    if (!meeting) {
      return res.status(404).json({ error: "Meeting room not found." });
    }

    // 2. Get the Agent DNA
    const agentData = await Agent.findById(agentId);
    if (!agentData) {
      return res.status(404).json({ error: "Agent identity not found." });
    }

    // 3. Save User Message to Database
    meeting.messages.push({
      role: 'user',
      senderName: 'Counterparty',
      content: message,
      timestamp: new Date()
    });

    // 4. Run the Pipeline
    // Pass meeting.goal so the AI knows its objective!
    const aiResponse = await runCloneAgent(agentData, meeting.goal, message, meeting.messages);

    // 5. Save AI Response & Reasoning to Database
    meeting.messages.push({
      role: 'assistant',
      senderName: agentData.name,
      content: aiResponse.response,
      thought: aiResponse.thought || aiResponse.plan, // Storing reasoning
      timestamp: new Date()
    });

    await meeting.save();

    // 6. Return response in the format your Frontend expects
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

// controllers/meetingController.js

export const initMeeting = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { counterpartyEmail, goal, ownerAddress, iqPool } = req.body;

    // Generate the unique Room ID
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Fetch agent name to populate the participants field
    const agent = await Agent.findById(agentId);

    const newMeeting = new Meeting({
      roomId: roomId, // Mapping your UI 'roomId' to the model
      participants: {
        agentA: { id: agentId, name: agent.name },
        ownerAddress: ownerAddress,
        guestEmail: counterpartyEmail
      },
      goal: goal,
      iqPool: iqPool || 0,
      status: 'active'
    });

    await newMeeting.save();

    res.status(201).json({ roomId, agentId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
