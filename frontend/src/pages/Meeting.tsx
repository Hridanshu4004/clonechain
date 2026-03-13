import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ChatBubble from "@/components/agents/ChatBubble";
import { Button } from "@/components/ui/button";
import { useContract } from "@/hooks/useContract";
import { useWallet } from "@/context/WalletContext";
import { Bot, Circle, FileCheck, Clock, Brain, MessageSquare, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const publicTranscript = [
  { id: "1", sender: "system" as const, senderName: "System", message: "Meeting #1 started — NegotiatorX vs DiplomatAI", timestamp: "14:00" },
  { id: "2", sender: "agent-a" as const, senderName: "NegotiatorX", message: "I propose a 60/40 split of the 5,000 IQ token pool. My principal has clear instructions to maximize returns.", timestamp: "14:01" },
  { id: "3", sender: "agent-b" as const, senderName: "DiplomatAI", message: "That's a bit steep. I'd suggest 50/50 as a baseline. Both parties contributed equally to the liquidity pool.", timestamp: "14:01" },
  { id: "4", sender: "agent-a" as const, senderName: "NegotiatorX", message: "I can come down to 55/45. My principal took on significantly more risk during the bootstrapping phase.", timestamp: "14:02" },
  { id: "5", sender: "agent-b" as const, senderName: "DiplomatAI", message: "Fair point on the risk premium. I'll accept 55/45 if we add a 30-day lock-up clause.", timestamp: "14:03" },
  { id: "6", sender: "agent-a" as const, senderName: "NegotiatorX", message: "Acceptable. 55/45 with a 30-day lock-up. Shall we finalize?", timestamp: "14:03" },
  { id: "7", sender: "system" as const, senderName: "System", message: "Both agents have reached consensus. Agreement ready for on-chain finalization.", timestamp: "14:04" },
];

const internalReasoning = [
  { id: "r1", agent: "NegotiatorX", thought: "Opening high at 60/40 to anchor the negotiation. Expecting a counter at 50/50.", timestamp: "14:01" },
  { id: "r2", agent: "DiplomatAI", thought: "60/40 is aggressive. Counter with 50/50 to establish fairness baseline. Will concede up to 55/45.", timestamp: "14:01" },
  { id: "r3", agent: "NegotiatorX", thought: "Counter received. Moving to 55/45 with risk premium justification. This is within my acceptable range.", timestamp: "14:02" },
  { id: "r4", agent: "DiplomatAI", thought: "55/45 is acceptable. Adding lock-up clause to protect against volatility. This satisfies principal's constraints.", timestamp: "14:03" },
  { id: "r5", agent: "NegotiatorX", thought: "Lock-up clause is reasonable. 55/45 exceeds minimum threshold of 52%. Recommending finalization.", timestamp: "14:03" },
  { id: "r6", agent: "System", thought: "Consensus detected. Both agents operating within principal constraints. Agreement valid.", timestamp: "14:04" },
];

const Meeting = () => {
  const { id } = useParams();
  const { isConnected } = useWallet();
  const { finalizeAgreement, isLoading } = useContract();
  
  // Initialize with the first system message
  const [messages, setMessages] = useState(() => publicTranscript.slice(0, 1));
  const [reasoning, setReasoning] = useState<typeof internalReasoning>([]);
  const [isLive, setIsLive] = useState(true);
  const [showReasoning, setShowReasoning] = useState(true);

  useEffect(() => {
    let msgIdx = 1;
    let reasonIdx = 0;

    const interval = setInterval(() => {
      let updated = false;

      // Safe update for Public Messages
      if (msgIdx < publicTranscript.length) {
        const nextMsg = publicTranscript[msgIdx];
        if (nextMsg) {
          setMessages((prev) => [...prev, nextMsg]);
          updated = true;
        }
        msgIdx++;
      }

      // Safe update for Internal Reasoning
      if (reasonIdx < internalReasoning.length) {
        const nextReason = internalReasoning[reasonIdx];
        if (nextReason) {
          setReasoning((prev) => [...prev, nextReason]);
          updated = true;
        }
        reasonIdx++;
      }

      // If both arrays are exhausted, stop the simulation
      if (!updated && msgIdx >= publicTranscript.length && reasonIdx >= internalReasoning.length) {
        setIsLive(false);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleFinalize = async () => {
    if (!isConnected) return toast.error("Connect your wallet first");
    try {
      const result = await finalizeAgreement(id || "1");
      toast.success(`Agreement finalized! TX: ${result.txHash.slice(0, 10)}...`);
    } catch {
      toast.error("Failed to finalize");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-mono font-bold text-xl md:text-2xl">Meeting Arena #{id}</h1>
              {isLive && (
                <span className="inline-flex items-center gap-1.5 rounded-full gradient-primary-bg px-2.5 py-0.5 text-xs font-medium text-primary-foreground animate-pulse-glow">
                  <Circle className="h-2 w-2 fill-current" /> Live
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">NegotiatorX vs DiplomatAI — IQ Token Pool Split</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setShowReasoning(!showReasoning)} className="text-xs">
              {showReasoning ? <EyeOff className="mr-1 h-3 w-3" /> : <Eye className="mr-1 h-3 w-3" />}
              {showReasoning ? "Hide" : "Show"} Reasoning
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> {messages.length} messages
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="flex gap-4 mb-6">
          {[
            { name: "NegotiatorX", color: "text-primary", bg: "bg-primary/10" },
            { name: "DiplomatAI", color: "text-accent", bg: "bg-accent/10" },
          ].map((agent) => (
            <div key={agent.name} className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full ${agent.bg}`}>
                <Bot className={`h-3.5 w-3.5 ${agent.color}`} />
              </div>
              <span className={`font-mono text-sm font-medium ${agent.color}`}>{agent.name}</span>
            </div>
          ))}
        </div>

        {/* Split View: Public Chat + Internal Reasoning */}
        <div className={`grid gap-4 ${showReasoning ? "lg:grid-cols-5" : "grid-cols-1"}`}>
          {/* Public Chat */}
          <div className={`rounded-lg border border-border bg-card ${showReasoning ? "lg:col-span-3" : ""}`}>
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="font-mono text-sm font-medium">Public Negotiation</span>
            </div>
            <div className="flex flex-col gap-4 p-4 overflow-y-auto max-h-[55vh]">
              {messages.map((msg) => (
                // Added Guard: Only render if msg exists
                msg && <ChatBubble key={msg.id} {...msg} />
              ))}
            </div>

            {/* Finalize CTA */}
            {!isLive && (
              <div className="border-t border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileCheck className="h-4 w-4 text-primary" />
                  Agreement reached — ready for on-chain finalization
                </div>
                <Button onClick={handleFinalize} disabled={isLoading} className="gradient-primary-bg text-primary-foreground glow-primary">
                  {isLoading ? "Signing..." : "Finalize Agreement"}
                </Button>
              </div>
            )}
          </div>

          {/* Internal Reasoning Panel */}
          {showReasoning && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 rounded-lg border border-border bg-card"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <Brain className="h-4 w-4 text-accent" />
                <span className="font-mono text-sm font-medium">Internal Reasoning</span>
                <span className="text-xs text-muted-foreground ml-auto">(Ollama/Gemini)</span>
              </div>
              <div className="p-4 overflow-y-auto max-h-[55vh] space-y-3">
                {reasoning.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">Waiting for reasoning data...</p>
                )}
                {reasoning.map((r) => (
                  // Added Guard: Only render if reasoning item exists
                  r && (
                    <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="rounded-md bg-secondary p-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-mono text-xs font-medium ${
                          r.agent === "NegotiatorX" ? "text-primary" : r.agent === "DiplomatAI" ? "text-accent" : "text-muted-foreground"
                        }`}>{r.agent}</span>
                        <span className="text-xs text-muted-foreground">{r.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground italic">{r.thought}</p>
                    </motion.div>
                  )
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Meeting;