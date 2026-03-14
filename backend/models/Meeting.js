import mongoose from 'mongoose';

const MeetingSchema = new mongoose.Schema({
  // Use roomId to match your frontend/controller logic
  roomId: { 
    type: String, 
    unique: true, 
    required: true,
    index: true
  },
  
  participants: {
    // The Agent representing the Owner
    agentA: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
      name: { type: String },
    },
    // Optional: for when two agents talk
    agentB: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
      name: { type: String },
    },
    ownerAddress: { type: String, required: true },
    guestEmail: { type: String, required: true } // From your Scheduler form
  },
  
  goal: { type: String, required: true },
  notes: { type: String }, // Extra context from Scheduler
  iqPool: { type: Number, default: 0 },
  
  // CHAT HISTORY
  // Storing this here replaces the need for local memoryManager.js RAM storage
  messages: [
    {
      role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
      senderName: { type: String },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      // Thought/Reasoning hidden from the Guest
      thought: { type: String } 
    }
  ],
  
  // MEETING RESULT
  result: {
    status: { 
      type: String, 
      enum: ['ongoing', 'agreed', 'rejected', 'finalized'],
      default: 'ongoing'
    },
    agreementText: { type: String },
    split: {
      ownerPercentage: { type: Number },
      guestPercentage: { type: Number },
    },
    onChainExecution: {
      isExecuted: { type: Boolean, default: false },
      txHash: { type: String },
    }
  },

  createdAt: { type: Date, default: Date.now, index: true }
});

// Indexes for fast lookup when a user views their dashboard
MeetingSchema.index({ ownerAddress: 1 });
MeetingSchema.index({ 'participants.initiatorUser': 1 });
MeetingSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Meeting', MeetingSchema);