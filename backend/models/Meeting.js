import mongoose from 'mongoose';

const MeetingSchema = new mongoose.Schema({
  // ================================
  // 1. MEETING IDENTIFICATION
  // ================================
  meetingId: { 
    type: String, 
    unique: true, 
    required: true,
    index: true
  },
  
  // ================================
  // 2. PARTICIPANTS
  // ================================
  participants: {
    agentA: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
      name: { type: String, required: true },
    },
    agentB: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
      name: { type: String, required: true },
    },
    initiatorUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    responderUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  
  // ================================
  // 3. MEETING SETUP
  // ================================
  goal: { 
    type: String, 
    required: true 
  },
  
  iqPool: { 
    type: Number, 
    required: true 
  },
  
  network: { 
    type: String, 
    enum: ['Ethereum', 'Base', 'Local'], 
    default: 'Ethereum' 
  },
  
  // ================================
  // 4. CHAT HISTORY (Embedded)
  // ================================
  messages: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      sender: { 
        type: String, 
        enum: ['agent-a', 'agent-b', 'system'],
        required: true 
      },
      senderName: { type: String, required: true },
      senderType: { type: String, enum: ['agent', 'user', 'system'] },
      message: { type: String, required: true },
      role: { type: String, enum: ['user', 'assistant', 'system'] },
      timestamp: { type: String },
      displayTime: { type: Date, default: Date.now },
      agentDecision: {
        decision: { type: String },
        reasoning: { type: String },
        confidence: { type: Number, min: 0, max: 1 }
      }
    }
  ],
  
  // ================================
  // 5. REASONING LOGS (Embedded)
  // ================================
  reasoningLogs: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      agentName: { type: String, required: true },
      thought: { type: String, required: true },
      decisionType: { type: String },
      inputContext: { type: mongoose.Schema.Types.Mixed },
      outputDecision: { type: mongoose.Schema.Types.Mixed },
      confidence: { type: Number, min: 0, max: 1 },
      constraints: [{ type: String }],
      timestamp: { type: String },
      executionTimeMs: { type: Number }
    }
  ],
  
  // ================================
  // 6. MEETING RESULT/AGREEMENT
  // ================================
  result: {
    status: { 
      type: String, 
      enum: ['ongoing', 'agreed', 'rejected', 'executed', 'finalized'],
      default: 'ongoing'
    },
    agreementText: { type: String },
    proposedTerms: { type: String },
    acceptedBy: { type: String },
    acceptanceMessage: { type: String },
    dealType: { 
      type: String, 
      enum: ['split', 'purchase', 'partnership', 'service'],
      default: 'split'
    },
    split: {
      agentAPercentage: { type: Number },
      agentBPercentage: { type: Number },
      amount: { type: Number },
    },
    additionalTerms: [{ type: String }],
    onChainExecution: {
      isExecuted: { type: Boolean, default: false },
      txHash: { type: String },
      blockNumber: { type: Number },
      gasUsed: { type: String },
      contractAddress: { type: String },
      timestamp: { type: String },
    },
    isValidated: { type: Boolean, default: false },
    validationNotes: { type: String },
    agreedAt: { type: Date },
    executedAt: { type: Date }
  },
  
  // ================================
  // 7. MEETING STATUS & TIMELINE
  // ================================
  status: { 
    type: String, 
    enum: ['active', 'completed', 'finalized', 'archived'],
    default: 'active'
  },
  
  isLive: { type: Boolean, default: true },
  
  createdAt: { type: Date, default: Date.now, index: true },
  startedAt: { type: Date },
  completedAt: { type: Date },
  
  // ================================
  // 8. METADATA
  // ================================
  metadata: { type: mongoose.Schema.Types.Mixed }
});

// Indexes
// MeetingSchema.index({ meetingId: 1 }); // Already defined with "unique: true, index: true" above
MeetingSchema.index({ 'participants.initiatorUser': 1 });
MeetingSchema.index({ status: 1, createdAt: -1 });
MeetingSchema.index({ 'result.onChainExecution.txHash': 1 });

export default mongoose.model('Meeting', MeetingSchema);
