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

// GET recent logs for dashboard
router.get('/logs', async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(20); // Last 20 logs
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;