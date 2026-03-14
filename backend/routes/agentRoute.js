import express from 'express';
import Agent from '../models/Agent.js';

const router = express.Router();

// POST: Save agent data after minting
router.post('/mint', async (req, res) => {
  try {
    const { 
      ownerAddress, 
      name, 
      iqStake, 
      brain, 
      lowerBoundary, 
      upperBoundary, 
      customRules, 
      decisionLogic,
      txHash 
    } = req.body;

    if (!ownerAddress || !name || !txHash) {
      return res.status(400).json({ error: "Missing identity credentials (Address, Name, or TxHash)." });
    }

    const newAgent = new Agent({
      ownerAddress,
      name,
      iqStake,
      brain,
      lowerBoundary,
      upperBoundary,
      customRules,
      decisionLogic,
      txHash
    });

    const savedAgent = await newAgent.save();

    res.status(201).json({
      success: true,
      agentId: savedAgent._id,
      message: "Agent identity synthesized in database."
    });

  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Neural storage failed." });
  }
});

//  GET: Fetch all agents for a specific wallet (Dashboard)
router.get('/owner/:address', async (req, res) => {
  try {
    const agents = await Agent.find({ ownerAddress: req.params.address });
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve your agents." });
  }
});

//  GET: Fetch a single agent's DNA (Meeting Arena initialization)
router.get('/:id', async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ error: "Agent not found." });
    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve agent DNA." });
  }
});

export default router;