import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ChatBubble from "@/components/agents/ChatBubble";
import { Button } from "@/components/ui/button";
import { useContract } from "@/hooks/useContract";
import { useWallet } from "@/context/WalletContext";
import { Circle, Brain, MessageSquare, Eye, EyeOff, Send } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import axios from "axios";

const Meeting = () => {
  // roomId from URL: /arena/:id
  const { id: meetingId } = useParams(); 
  const [searchParams] = useSearchParams();
  const agentIdFromUrl = searchParams.get("agentId"); 
  
  const { isConnected } = useWallet();
  const { finalizeAgreement, isLoading: isContractLoading } = useContract();
  
  // State
  const [messages, setMessages] = useState<any[]>([]);
  const [reasoning, setReasoning] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [showReasoning, setShowReasoning] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [agentData, setAgentData] = useState<any>(null);
  const [meetingData, setMeetingData] = useState<any>(null); // Added for Goal/Context
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Fetch Meeting Room Data (which includes the Agent)
  useEffect(() => {
    const fetchRoomData = async () => {
      if (!meetingId) {
        setIsInitialLoading(false);
        return;
      }
      try {
        // We fetch the room by the roomId (the 6-char code)
        const res = await axios.get(`http://localhost:5000/api/meeting/room/${meetingId}`);
        
        setMeetingData(res.data);
        
        // Map the agent from the meeting participants to your existing agentData state
        // This keeps your UI logic working perfectly
        if (res.data.participants?.agentA?.id) {
          setAgentData(res.data.participants.agentA.id);
        } else if (agentIdFromUrl) {
          // Fallback if the meeting doesn't have the agent populated yet
          const agentRes = await axios.get(`http://localhost:5000/api/agents/${agentIdFromUrl}`);
          setAgentData(agentRes.data);
        }

        // Set live status based on database result
        if (res.data.result?.status !== 'ongoing') {
          setIsLive(false);
        }

      } catch (err) {
        console.error("Room fetch error:", err);
        toast.error("Meeting room not found or expired.");
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchRoomData();
  }, [meetingId, agentIdFromUrl]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    // We now check for meetingData too to ensure context exists
    if (!inputText.trim() || !agentData || !meetingData) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      senderName: "Counterparty",
      message: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText("");
    setIsTyping(true);

    try {
      // Hit the Meeting Chat Controller
      const res = await axios.post("http://localhost:5000/api/meeting/chat", {
        agentId: agentData._id,
        roomId: meetingId, // Passing the 6-char Room ID
        message: currentInput,
        // The backend uses meetingId to pull 'goal' and 'history' from MongoDB
      });

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: "agent-a",
        senderName: agentData.name,
        message: res.data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      
      if (res.data.thought || res.data.plan) {
        setReasoning((prev) => [...prev, {
          id: Date.now().toString(),
          agent: agentData.name,
          thought: res.data.thought || res.data.plan,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }

    } catch (err) {
      toast.error("Agent failed to respond. Verify backend is running.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleFinalize = async () => {
    if (!isConnected) return toast.error("Connect your wallet first");
    try {
      const result = await finalizeAgreement(meetingId || "1");
      toast.success(`Agreement finalized on-chain!`);
      setIsLive(false);
    } catch {
      toast.error("Failed to finalize contract");
    }
  };

  if (isInitialLoading) {
    return <div className="min-h-screen pt-32 text-center font-mono animate-pulse">Establishing Secure Connection...</div>;
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-mono font-bold text-xl md:text-2xl">Meeting Arena #{meetingId}</h1>
              {isLive && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500 animate-pulse">
                  <Circle className="h-2 w-2 fill-current" /> Live Negotiation
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {agentData ? `${agentData.name} representing Owner` : "Generic Negotiator"} 
              {meetingData?.goal && <span className="ml-2 border-l pl-2 text-primary font-mono text-[10px]">GOAL: {meetingData.goal}</span>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setShowReasoning(!showReasoning)} className="text-xs">
              {showReasoning ? <EyeOff className="mr-1 h-3 w-3" /> : <Eye className="mr-1 h-3 w-3" />}
              {showReasoning ? "Hide" : "Show"} Reasoning
            </Button>
          </div>
        </div>

        {/* Split View */}
        <div className={`grid gap-4 ${showReasoning ? "lg:grid-cols-5" : "grid-cols-1"}`}>
          <div className={`rounded-lg border border-border bg-card flex flex-col ${showReasoning ? "lg:col-span-3" : ""}`}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="font-mono text-sm font-medium">Chat Interface</span>
              </div>
              {!isLive && <span className="text-xs text-green-500 font-bold">AGREEMENT REACHED</span>}
            </div>

            {/* Chat Messages */}
            <div className="flex flex-col gap-4 p-4 overflow-y-auto h-[450px]">
              {messages.length === 0 && (
                <div className="text-center py-20 text-muted-foreground text-sm italic">
                  {meetingData?.goal ? `Goal: ${meetingData.goal}. Start the conversation...` : "Waiting for opening proposal..."}
                </div>
              )}
              {messages.map((msg) => (
                <ChatBubble key={msg.id} {...msg} />
              ))}
              {isTyping && <div className="text-xs text-muted-foreground animate-pulse px-4 font-mono">Agent is processing boundaries...</div>}
            </div>

            {/* Input Area */}
            {isLive && (
              <form onSubmit={sendMessage} className="p-4 border-t border-border flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter proposal (e.g. 'I offer 600 IQ')"
                  className="flex-1 bg-secondary border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button type="submit" size="sm" className="gradient-primary-bg" disabled={!agentData}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            )}

            {/* Finalize Button */}
            {!isLive && (
              <div className="p-4 bg-primary/5 flex justify-center">
                <Button onClick={handleFinalize} disabled={isContractLoading} className="w-full max-w-xs">
                  {isContractLoading ? "Finalizing..." : "Execute on-chain"}
                </Button>
              </div>
            )}
          </div>

          {/* Reasoning Panel */}
          {showReasoning && (
            <div className="lg:col-span-2 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <Brain className="h-4 w-4 text-accent" />
                <span className="font-mono text-sm font-medium">Internal Reasoning</span>
              </div>
              <div className="p-4 overflow-y-auto max-h-[500px] space-y-3">
                {reasoning.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No thoughts processed yet.</p>
                )}
                {reasoning.map((r) => (
                  <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-md bg-secondary p-3 border-l-2 border-accent">
                    <p className="text-xs font-bold text-accent mb-1 uppercase tracking-tighter">{r.agent} Logic:</p>
                    <p className="text-sm text-muted-foreground italic leading-relaxed">"{r.thought}"</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Meeting;