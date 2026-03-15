import express from 'express';
import { handleMeetingChat,initMeeting } from '../controllers/meetingController.js';
import Meeting from '../models/Meeting.js';
import Log from '../models/Log.js';

const router = express.Router();

// Route for the meeting arena chat
router.post('/chat', handleMeetingChat);


// Initialize a new shared meeting room
router.post('/init/:agentId', initMeeting);


// GET meeting details by Room ID
router.get('/room/:roomId', async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ roomId: req.params.roomId })
      .populate('participants.agentA.id'); // This pulls in the Agent's rules!
    
    if (!meeting) return res.status(404).json({ error: "Room not found" });
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/logs', async (req, res) => {
  try {
    
    const logs = await Log.find().sort({ timestamp: -1 }).limit(100); 

    res.json(logs);
  } catch (error) {
    console.error("Audit Log Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

export default router;