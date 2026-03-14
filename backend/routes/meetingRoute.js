import express from 'express';
import { handleMeetingChat,initMeeting } from '../controllers/meetingController.js';

const router = express.Router();

// Route for the meeting arena chat
router.post('/chat', handleMeetingChat);


// Initialize a new shared meeting room
router.get('/init/:agentId', initMeeting);


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

export default router;