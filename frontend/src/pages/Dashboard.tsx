import { useState, useEffect } from "react"; // Added hooks
import AgentCard from "@/components/agents/AgentCard";
import { Button } from "@/components/ui/button";
import { Plus, Activity, Zap, Bot, FileCheck, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useWallet } from "@/context/WalletContext";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import axios from "axios"; // Added axios
import { toast } from "sonner";

const recentActivity = [
  { time: "Just now", text: "System synchronized with Lab", type: "success" },
  { time: "2 min ago", text: "NegotiatorX entered Meeting #12", type: "live" },
  { time: "Yesterday", text: "Meeting invitation sent to partner@example.com", type: "invite" },
];

const Dashboard = () => {
  const { isConnected, address } = useWallet(); // Use 'address' for API calls
  const { user, isLoading: authLoading } = useAuth();
  
  // --- NEW STATE FOR REAL DATA ---
  const [agents, setAgents] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchMyAgents = async () => {
      if (!isConnected || !address) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/agents/owner/${address}`);
        setAgents(res.data);
      } catch (err) {
        console.error("Failed to fetch agents", err);
        toast.error("Could not sync agents from Lab");
      } finally {
        setIsFetching(false);
      }
    };

    fetchMyAgents();
  }, [isConnected, address]);

  // --- DYNAMIC STATS CALCULATION ---
  const totalStaked = agents.reduce((acc, curr) => acc + (Number(curr.iqStake) || 0), 0);
  
  const stats = [
    { label: "Minted Agents", value: agents.length.toString(), icon: Bot },
    { label: "Live Meetings", value: "1", icon: Activity },
    { label: "Total IQ Staked", value: totalStaked.toLocaleString(), icon: Zap },
    { label: "Agreements Finalized", value: "0", icon: FileCheck },
  ];

  if (authLoading) return <div className="min-h-screen pt-24 flex items-center justify-center font-mono">Loading Identity...</div>;
  if (!user) return <Navigate to="/login" />;

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <h2 className="font-mono font-bold text-xl mb-1 text-primary">Welcome, {user.nickname}</h2>
            <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest">{user.email}</p>
          </div>
          <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-mono font-bold text-xl mb-2">Wallet Sync Required</h2>
          <p className="text-muted-foreground mb-6">Connect your wallet to manage your AI agents.</p>
          <div className="p-3 bg-secondary rounded-lg border border-border inline-block max-w-xs mx-auto">
            <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Linked Wallet</p>
            <p className="text-xs font-mono break-all">{user.walletAddress}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-mono font-bold text-2xl md:text-3xl">Dashboard</h1>
              <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-mono">
                {user.nickname}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">Manage your minted AI agents and monitor activity status.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="glow-border">
              <Link to="/scheduler">
                <Clock className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Link>
            </Button>
            <Button asChild className="gradient-primary-bg text-primary-foreground font-semibold glow-primary">
              <Link to="/agent-lab">
                <Plus className="mr-2 h-4 w-4" />
                New Agent
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-lg border border-border bg-card p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="font-mono font-bold text-xl">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Agents Grid */}
          <div className="lg:col-span-2">
            <h2 className="font-mono font-semibold text-lg mb-4">Your Agents</h2>
            {isFetching ? (
              <div className="font-mono text-sm animate-pulse">Scanning blockchain for agents...</div>
            ) : agents.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {agents.map((agent) => (
                  <AgentCard 
                    key={agent._id} 
                    id={agent._id}
                    name={agent.name}
                    personality={agent.customRules} // Mapping rule summary to card
                    status="live"
                    iqTokens={agent.iqStake}
                    meetingsCount={0}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 border border-dashed rounded-lg text-center">
                <p className="text-muted-foreground font-mono text-sm mb-4">No agents synthesized yet.</p>
                <Button asChild variant="secondary" size="sm">
                  <Link to="/agent-lab">Go to Lab</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div>
            <h2 className="font-mono font-semibold text-lg mb-4">Recent Activity</h2>
            <div className="rounded-lg border border-border bg-card p-4 space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                    item.type === "live" ? "bg-primary animate-pulse" :
                    item.type === "success" ? "bg-primary" :
                    item.type === "mint" ? "bg-accent" : "bg-muted-foreground"
                  }`} />
                  <div>
                    <p className="text-sm text-foreground">{item.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;