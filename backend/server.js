import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import agentRoutes from './routes/agentRoute.js';
import meetingRoutes from './routes/meetingRoutes.js';

const app = express();
dotenv.config();

connectDB();



app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CloneChain Backend Running 🚀");
});

app.use('/api/auth', authRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/meetings', meetingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});