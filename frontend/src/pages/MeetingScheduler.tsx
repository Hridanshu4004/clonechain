import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useWallet } from "@/context/WalletContext";
import { CalendarClock, Send, Bot, Mail, Target, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const mockAgents = [
  { id: 1, name: "NegotiatorX" },
  { id: 2, name: "DiplomatAI" },
  { id: 3, name: "SharkBot" },
  { id: 4, name: "ConsensusPrime" },
];

const MeetingScheduler = () => {
  const { isConnected } = useWallet();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    counterpartyEmail: "",
    goal: "",
    selectedAgent: "",
    notes: "",
  });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSend = async () => {
    if (!form.counterpartyEmail || !form.goal || !form.selectedAgent) {
      return toast.error("Please fill all required fields");
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    toast.success("Meeting invitation sent successfully!");
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
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-mono font-bold text-xl mb-2">Invitation Sent!</h2>
          <p className="text-muted-foreground text-sm mb-2">An email has been sent to <span className="text-foreground font-mono">{form.counterpartyEmail}</span></p>
          <p className="text-xs text-muted-foreground mb-6">They will land on the Invite Hub where they can accept and start the AI negotiation.</p>
          <div className="rounded-lg border border-border bg-card p-4 text-left mb-6">
            <p className="text-xs text-muted-foreground mb-1">Agent</p>
            <p className="font-mono text-sm font-medium mb-3">{form.selectedAgent}</p>
            <p className="text-xs text-muted-foreground mb-1">Goal</p>
            <p className="text-sm">{form.goal}</p>
          </div>
          <Button onClick={() => { setSent(false); setForm({ counterpartyEmail: "", goal: "", selectedAgent: "", notes: "" }); }} variant="outline">
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
        <p className="text-muted-foreground text-sm mb-8">Enter counterparty email & goal. An invite will be sent via Email API.</p>

        <div className="rounded-lg border border-border bg-card p-6 md:p-8 space-y-6">
          {/* Select Agent */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              <Bot className="inline h-3.5 w-3.5 mr-1 text-primary" />
              Your Agent
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {mockAgents.map((a) => (
                <button
                  key={a.id}
                  onClick={() => update("selectedAgent", a.name)}
                  className={`rounded-lg border p-3 text-left font-mono text-sm transition-all ${
                    form.selectedAgent === a.name ? "border-primary glow-border" : "border-border hover:border-muted-foreground"
                  }`}
                >
                  {a.name}
                </button>
              ))}
            </div>
          </div>

          {/* Counterparty Email */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              <Mail className="inline h-3.5 w-3.5 mr-1 text-primary" />
              Counterparty Email
            </Label>
            <Input value={form.counterpartyEmail} onChange={(e) => update("counterpartyEmail", e.target.value)}
              placeholder="partner@example.com" type="email" className="font-mono" />
          </div>

          {/* Goal */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              <Target className="inline h-3.5 w-3.5 mr-1 text-primary" />
              Negotiation Goal
            </Label>
            <Textarea value={form.goal} onChange={(e) => update("goal", e.target.value)}
              placeholder="Negotiate a 60/40 split of the 5,000 IQ token pool..." rows={3} className="font-mono" />
          </div>

          {/* Notes */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Additional Notes (optional)</Label>
            <Textarea value={form.notes} onChange={(e) => update("notes", e.target.value)}
              placeholder="Any context for the meeting..." rows={2} />
          </div>

          <Button onClick={handleSend} disabled={sending} className="w-full gradient-primary-bg text-primary-foreground glow-primary font-semibold">
            {sending ? "Sending..." : "Send Invitation"}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MeetingScheduler;
