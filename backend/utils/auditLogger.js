import Log from '../models/Log.js';

export const saveAuditLog = async (data) => {
  try {
    const newLog = new Log({
      roomId: data.roomId,
      model: data.model,
      tokens: data.tokens,
      cost: data.cost,
      latency: data.latency,
      status: data.status
    });
    await newLog.save();
    console.log(`[Audit] Log saved for room: ${data.roomId}`);
  } catch (error) {
    console.error("[Audit] Error saving log:", error);
  }
};