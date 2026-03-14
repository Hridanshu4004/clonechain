import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useWallet } from "@/context/WalletContext";
import { CalendarClock, Send, Bot, Mail, Target, CheckCircle, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";

const MeetingScheduler = () => {
  const { isConnected, address } = useWallet();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [myAgents, setMyAgents] = useState<any[]>([]);
  const [shareLink, setShareLink] = useState("");
  
  const [form, setForm] = useState({
    counterpartyEmail: "",
    goal: "",
    selectedAgentId: "",
    selectedAgentName: "",
    notes: "",
  });

  // Fetch real agents from your backend
  useEffect(() => {
    const fetchAgents = async () => {
      if (isConnected && address) {
        try {
          const res = await axios.get(`http://localhost:5000/api/agents/owner/${address}`);
          setMyAgents(res.data);
        } catch (err) {
          console.error("Agent fetch error:", err);
          toast.error("Failed to load your agents from database");
        }
      }
    };
    fetchAgents();
  }, [isConnected, address]);

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSend = async () => {
  if (!form.counterpartyEmail || !form.goal || !form.selectedAgentId) {
    return toast.error("Please fill all required fields");
  }

  setSending(true);
  try {
    // 1. MUST BE axios.post
    // 2. MUST include the data object as the second argument
    
    const res = await axios.post(`http://localhost:5000/api/meeting/init/${form.selectedAgentId}`, {
      counterpartyEmail: form.counterpartyEmail,
      goal: form.goal,
      ownerAddress: address, // From your useWallet() hook
      notes: form.notes
    });

    
    
    // Construct the live meeting link using the roomId from the response
    const link = `${window.location.origin}/arena/${res.data.roomId}?agentId=${form.selectedAgentId}`;
    setShareLink(link);

    setSent(true);
    toast.success("Meeting room generated successfully!");
  } catch (err) {
    console.error("Init meeting error:", err);
    toast.error("Failed to initialize meeting room. Check if backend is running.");
  } finally {
    setSending(false);
  }
};
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    toast.info("Link copied to clipboard");
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <CalendarClock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-mono font-bold text-xl mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground">Connect to schedule meetings.</p>
        </div>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="text-center max-w-md w-full"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-mono font-bold text-xl mb-2">Invitation Ready!</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Share this secure link with <span className="text-foreground font-mono">{form.counterpartyEmail}</span> to begin the negotiation.
          </p>
          
          <div className="rounded-lg border border-border bg-secondary p-3 mb-6 flex items-center gap-2">
            <input 
              readOnly 
              value={shareLink} 
              className="bg-transparent text-[10px] font-mono w-full outline-none text-muted-foreground"
            />
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 text-left mb-6">
            <p className="text-xs text-muted-foreground mb-1">Agent Representative</p>
            <p className="font-mono text-sm font-medium mb-3">{form.selectedAgentName}</p>
            <p className="text-xs text-muted-foreground mb-1">Negotiation Goal</p>
            <p className="text-sm line-clamp-2">{form.goal}</p>
          </div>

          <Button 
            onClick={() => { 
              setSent(false); 
              setForm({ counterpartyEmail: "", goal: "", selectedAgentId: "", selectedAgentName: "", notes: "" }); 
            }} 
            variant="outline"
            className="w-full"
          >
            Schedule Another
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="flex items-center gap-3 mb-2">
          <CalendarClock className="h-6 w-6 text-primary" />
          <h1 className="font-mono font-bold text-2xl md:text-3xl">Meeting Scheduler</h1>
        </div>
        <p className="text-muted-foreground text-sm mb-8">
          Provision a secure negotiation room. Your agent will represent your interests based on the goal provided.
        </p>

        <div className="rounded-lg border border-border bg-card p-6 md:p-8 space-y-6">
          {/* Select Agent - Now Dynamic from Database */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              <Bot className="inline h-3.5 w-3.5 mr-1 text-primary" />
              Your Agent
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {myAgents.length > 0 ? (
                myAgents.map((a) => (
                  <button
                    key={a._id}
                    onClick={() => {
                      update("selectedAgentId", a._id);
                      update("selectedAgentName", a.name);
                    }}
                    className={`rounded-lg border p-3 text-left font-mono text-sm transition-all ${
                      form.selectedAgentId === a._id 
                        ? "border-primary glow-border bg-primary/5" 
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    {a.name}
                  </button>
                ))
              ) : (
                <div className="col-span-2 p-4 border border-dashed rounded-lg text-center">
                   <p className="text-xs text-muted-foreground mb-2">No agents found for this wallet.</p>
                   <Button variant="link" className="h-auto p-0 text-xs" asChild>
                     <a href="/agent-lab">Mint an Agent First</a>
                   </Button>
                </div>
              )}
            </div>
          </div>

          {/* Counterparty Email */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              <Mail className="inline h-3.5 w-3.5 mr-1 text-primary" />
              Counterparty Email
            </Label>
            <Input 
              value={form.counterpartyEmail} 
              onChange={(e) => update("counterpartyEmail", e.target.value)}
              placeholder="partner@example.com" 
              type="email" 
              className="font-mono" 
            />
          </div>

          {/* Goal */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              <Target className="inline h-3.5 w-3.5 mr-1 text-primary" />
              Negotiation Goal
            </Label>
            <Textarea 
              value={form.goal} 
              onChange={(e) => update("goal", e.target.value)}
              placeholder="e.g., Secure a 10% discount on the service contract..." 
              rows={3} 
              className="font-mono" 
            />
          </div>

          {/* Notes */}
          <div>
            <Label className="text-sm font-medium mb-2 block text-muted-foreground">Additional Context (Internal)</Label>
            <Textarea 
              value={form.notes} 
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Private notes for your agent's strategy..." 
              rows={2} 
            />
          </div>

          <Button 
            onClick={handleSend} 
            disabled={sending || myAgents.length === 0} 
            className="w-full gradient-primary-bg text-primary-foreground glow-primary font-semibold"
          >
            {sending ? "Generating Room..." : "Initialize Meeting"}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MeetingScheduler;