import express from "express";
import { runCloneAgent } from "../agent/cloneAgent.js";

const router = express.Router();

router.post("/chat", async (req, res) => {

  try {

    const { message, meetingId } = req.body;

    const userProfile = {
      name: "Hridanshu",
      role: "startup founder",
      style: "direct but friendly",
      maxBudget: 5000
    };

    const reply = await runCloneAgent(
      userProfile,
      meetingId,
      message
    );

    res.json({ reply });

  } catch (error) {

    console.error(error);

    res.status(500).json({ error: "Agent failed" });

  }

});

export default router;