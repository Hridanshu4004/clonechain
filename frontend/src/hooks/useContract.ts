import { useState, useCallback } from "react";

// Mock contract interaction hook for frontend demo
export const useContract = () => {
  const [isLoading, setIsLoading] = useState(false);

  const mintAgent = useCallback(async (name: string, systemPrompt: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsLoading(false);
    return { txHash: "0x" + Math.random().toString(16).slice(2, 66), agentId: Math.floor(Math.random() * 1000) };
  }, []);

  const finalizeAgreement = useCallback(async (meetingId: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsLoading(false);
    return { txHash: "0x" + Math.random().toString(16).slice(2, 66) };
  }, []);

  return { mintAgent, finalizeAgreement, isLoading };
};
