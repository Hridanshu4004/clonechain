import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import agentRoutes from './routes/agentRoute.js';
import meetingRoutes from './routes/meetingRoute.js';
import negotiateRoute from './routes/negotiate.js';

dotenv.config();
connectDB();


const app = express();




app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CloneChain Backend Running 🚀");
});



app.use((req, res, next) => {
  console.log("---------------------------------------");
  console.log(`[${new Date().toLocaleTimeString()}] REQ: ${req.method} ${req.originalUrl}`);
  console.log("Body:", req.body);
  console.log("Params:", req.params);
  console.log("---------------------------------------");
  next();
});

//routes
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/meeting', meetingRoutes);
app.use('/api/negotiate', negotiateRoute);


// app.use(notFound);
// app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});