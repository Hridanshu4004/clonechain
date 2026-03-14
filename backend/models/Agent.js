import mongoose from 'mongoose';

const AgentSchema = new mongoose.Schema({
  ownerAddress: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  iqStake: {
    type: Number,
    required: true,
    default: 100,
  },
  brain: {
    type: String,
    enum: ['ollama', 'gemini'],
    default: 'gemini',
  },
  // Operational Boundaries for Negotiations
  lowerBoundary: {
    type: String,
    required: true, 
  },
  upperBoundary: {
    type: String,
    required: true,
  },
  customRules: {
    type: String,
  },
  decisionLogic: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'terminated'],
    default: 'active',
  },
  txHash: {
    type: String, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Agent = mongoose.model('Agent', AgentSchema);
export default Agent;