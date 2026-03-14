import express from "express";
import { negotiateOffer } from "../agent/negotiationEngine.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { offer, agentData } = req.body;

    const result = await negotiateOffer(offer, agentData || {});

    res.json({ response: result });
  } catch (error) {
    console.error("Negotiation route error:", error);
    res.status(500).json({ error: "Negotiation failed", message: error.message });
  }
});

export default router;
