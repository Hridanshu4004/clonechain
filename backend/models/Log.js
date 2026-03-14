import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  model: String,
  tokens: Number,
  cost: Number,
  latency: Number,
  status: String, // 'negotiating' or 'completed'
  endpoint: { type: String, default: '/api/meeting/chat' },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Log', logSchema);