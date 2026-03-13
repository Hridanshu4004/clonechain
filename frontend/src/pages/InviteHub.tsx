import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/WalletContext";
import { Bot, Shield, Zap, UserCheck, ArrowRight, Wallet, Swords } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const InviteHub = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isConnected, connectWallet } = useWallet();
  const [accepting, setAccepting] = useState(false);

  const mockInvite = {
    from: "0x1234...abcd",
    agentName: "NegotiatorX",
    goal: "Negotiate a 60/40 split of the 5,000 IQ token pool",
    iqPool: "5,000",
    meetingId: id || "1",
  };

  const handleAccept = async () => {
    if (!isConnected) return toast.error("Connect your wallet first");
    setAccepting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setAccepting(false);
    toast.success("Meeting accepted! Entering the Arena...");
    navigate(`/meeting/${mockInvite.meetingId}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="container mx-auto max-w-lg px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
            <Swords className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-mono font-bold text-2xl md:text-3xl mb-2">You've Been Challenged</h1>
          <p className="text-muted-foreground text-sm">An AI agent wants to negotiate with you.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-5"
        >
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-mono font-semibold">{mockInvite.agentName}</p>
              <p className="text-xs text-muted-foreground">Sent by {mockInvite.from}</p>
            </div>
          </div>

          <div className="rounded-md bg-secondary p-4">
            <p className="text-xs text-muted-foreground mb-1">Negotiation Goal</p>
            <p className="text-sm">{mockInvite.goal}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md bg-secondary p-3">
              <p className="text-xs text-muted-foreground mb-1">IQ Pool</p>
              <p className="font-mono font-medium flex items-center gap-1">
                <Zap className="h-3 w-3 text-primary" /> {mockInvite.iqPool}
              </p>
            </div>
            <div className="rounded-md bg-secondary p-3">
              <p className="text-xs text-muted-foreground mb-1">Network</p>
              <p className="font-mono font-medium text-sm">Ethereum / Base</p>
            </div>
          </div>

          <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-primary" />
              Accepting will deploy your agent into the Meeting Arena for live AI negotiation.
            </p>
          </div>

          {!isConnected ? (
            <Button onClick={connectWallet} className="w-full gradient-primary-bg text-primary-foreground glow-primary font-semibold">
              <Wallet className="mr-2 h-4 w-4" /> Connect Wallet to Accept
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => navigate("/")}>Decline</Button>
              <Button onClick={handleAccept} disabled={accepting} className="flex-1 gradient-primary-bg text-primary-foreground glow-primary font-semibold">
                {accepting ? "Joining..." : "Accept & Enter Arena"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1">
          <UserCheck className="h-3 w-3" /> By accepting, you agree to the on-chain negotiation terms.
        </p>
      </div>
    </div>
  );
};

export default InviteHub;
