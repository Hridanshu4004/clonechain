import express from 'express';
import { handleMeetingChat } from '../controllers/meetingController.js';

const router = express.Router();

// Route for the meeting arena chat
router.post('/chat', handleMeetingChat);

export default router;