const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');
const { executeOnBlockchainSafe } = require('../utils/blockchainExecutor');

// ================================
// CREATE A NEW MEETING
// ================================
router.post('/create', async (req, res) => {
  try {
    const { meetingId, agentA, agentB, initiatorUser, goal, iqPool, network } = req.body;

    const newMeeting = new Meeting({
      meetingId,
      participants: {
        agentA: { id: agentA.id, name: agentA.name },
        agentB: { id: agentB.id, name: agentB.name },
        initiatorUser,
      },
      goal,
      iqPool,
      network: network || 'Ethereum',
      messages: [],
      reasoningLogs: [],
      result: {
        status: 'ongoing'
      },
      status: 'active',
      isLive: true,
      startedAt: new Date()
    });

    await newMeeting.save();

    res.status(201).json({
      success: true,
      message: 'Meeting created successfully',
      meeting: newMeeting
    });
  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ================================
// GET MEETING BY ID
// ================================
router.get('/:meetingId', async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ meetingId: req.params.meetingId })
      .populate('participants.agentA.id participants.agentB.id');

    if (!meeting) {
      return res.status(404).json({
        success: false,
        error: 'Meeting not found'
      });
    }

    res.json({
      success: true,
      meeting
    });
  } catch (error) {
    console.error('Error fetching meeting:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ================================
// ADD MESSAGE TO MEETING
// ================================
router.post('/:meetingId/messages', async (req, res) => {
  try {
    const { sender, senderName, senderType, message, role, timestamp, agentDecision } = req.body;

    const meeting = await Meeting.findOne({ meetingId: req.params.meetingId });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        error: 'Meeting not found'
      });
    }

    const newMessage = {
      sender,
      senderName,
      senderType: senderType || (sender.includes('agent') ? 'agent' : 'user'),
      message,
      role: role || 'user',
      timestamp,
      displayTime: new Date(),
      agentDecision: agentDecision || {}
    };

    meeting.messages.push(newMessage);
    await meeting.save();

    res.status(201).json({
      success: true,
      message: 'Message added successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ================================
// ADD REASONING LOG TO MEETING
// ================================
router.post('/:meetingId/reasoning', async (req, res) => {
  try {
    const { agentName, thought, decisionType, inputContext, outputDecision, confidence, constraints, timestamp, executionTimeMs } = req.body;

    const meeting = await Meeting.findOne({ meetingId: req.params.meetingId });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        error: 'Meeting not found'
      });
    }

    const newReasoningLog = {
      agentName,
      thought,
      decisionType,
      inputContext,
      outputDecision,
      confidence: confidence || 0.5,
      constraints: constraints || [],
      timestamp,
      executionTimeMs: executionTimeMs || 0
    };

    meeting.reasoningLogs.push(newReasoningLog);
    await meeting.save();

    res.status(201).json({
      success: true,
      message: 'Reasoning log added successfully',
      data: newReasoningLog
    });
  } catch (error) {
    console.error('Error adding reasoning log:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ================================
// UPDATE MEETING RESULT (Agreement reached)
// ================================
router.put('/:meetingId/result', async (req, res) => {
  try {
    const { status, acceptedBy, acceptanceMessage, split, additionalTerms, dealType } = req.body;

    const meeting = await Meeting.findOne({ meetingId: req.params.meetingId });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        error: 'Meeting not found'
      });
    }

    meeting.result.status = status || meeting.result.status;
    meeting.result.acceptedBy = acceptedBy || meeting.result.acceptedBy;
    meeting.result.acceptanceMessage = acceptanceMessage || meeting.result.acceptanceMessage;
    meeting.result.split = split || meeting.result.split;
    meeting.result.additionalTerms = additionalTerms || meeting.result.additionalTerms;
    meeting.result.dealType = dealType || meeting.result.dealType;
    meeting.result.agreedAt = new Date();

    if (status === 'agreed' || status === 'executed') {
      meeting.status = 'completed';
      meeting.completedAt = new Date();
    }

    await meeting.save();

    res.json({
      success: true,
      message: 'Meeting result updated successfully',
      meeting
    });
  } catch (error) {
    console.error('Error updating meeting result:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ================================
// FINALIZE ON BLOCKCHAIN
// ================================
router.post('/:meetingId/finalize', async (req, res) => {
  try {
    const { contractAddress, agreementData } = req.body;

    const meeting = await Meeting.findOne({ meetingId: req.params.meetingId });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        error: 'Meeting not found'
      });
    }

    const blockchainResult = await executeOnBlockchainSafe({
      contractAddress,
      meetingId: meeting.meetingId,
      agentA: meeting.participants.agentA.name,
      agentB: meeting.participants.agentB.name,
      split: meeting.result.split,
      iqPool: meeting.iqPool,
      agreementData
    });

    meeting.result.onChainExecution.isExecuted = true;
    meeting.result.onChainExecution.txHash = blockchainResult.txHash;
    meeting.result.onChainExecution.blockNumber = blockchainResult.blockNumber;
    meeting.result.onChainExecution.gasUsed = blockchainResult.gasUsed;
    meeting.result.onChainExecution.contractAddress = contractAddress;
    meeting.result.onChainExecution.timestamp = new Date().toISOString();
    meeting.result.executedAt = new Date();
    meeting.result.status = 'finalized';
    meeting.status = 'finalized';
    meeting.isLive = false;

    await meeting.save();

    res.json({
      success: true,
      message: 'Meeting finalized on blockchain',
      meeting,
      blockchainResult
    });
  } catch (error) {
    console.error('Error finalizing on blockchain:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ================================
// GET ALL MEETINGS (with filters)
// ================================
router.get('/', async (req, res) => {
  try {
    const { status, initiatorUser } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (initiatorUser) filter['participants.initiatorUser'] = initiatorUser;

    const meetings = await Meeting.find(filter)
      .sort({ createdAt: -1 })
      .populate('participants.agentA.id participants.agentB.id');

    res.json({
      success: true,
      count: meetings.length,
      meetings
    });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ================================
// GET MEETING AGREEMENTS (for AgreementLedger)
// ================================
router.get('/ledger/agreements', async (req, res) => {
  try {
    const agreements = await Meeting.find({
      'result.status': { $in: ['agreed', 'finalized'] },
      'result.onChainExecution.txHash': { $exists: true, $ne: null }
    }).select('meetingId participants result createdAt').sort({ createdAt: -1 });

    const formattedAgreements = agreements.map((meeting, index) => ({
      id: `AGR-${String(index + 1).padStart(3, '0')}`,
      meetingId: meeting.meetingId,
      agentA: meeting.participants.agentA.name,
      agentB: meeting.participants.agentB.name,
      terms: meeting.result.agreementText || meeting.result.proposedTerms,
      txHash: meeting.result.onChainExecution.txHash,
      blockNumber: meeting.result.onChainExecution.blockNumber,
      gasUsed: meeting.result.onChainExecution.gasUsed,
      timestamp: meeting.result.onChainExecution.timestamp,
      status: 'verified',
      network: meeting.result.onChainExecution.contractAddress ? 'Ethereum Mainnet' : 'Local'
    }));

    res.json({
      success: true,
      count: formattedAgreements.length,
      agreements: formattedAgreements
    });
  } catch (error) {
    console.error('Error fetching agreements:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
