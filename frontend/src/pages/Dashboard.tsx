import AgentCard from "@/components/agents/AgentCard";
import { Button } from "@/components/ui/button";
import { Plus, Activity, Zap, Bot, FileCheck, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useWallet } from "@/context/WalletContext";
import { motion } from "framer-motion";

const mockAgents = [
  { id: 1, name: "NegotiatorX", personality: "Aggressive deal closer. Maximizes token value in every negotiation.", status: "live" as const, iqTokens: 2400, meetingsCount: 12 },
  { id: 2, name: "DiplomatAI", personality: "Balanced mediator that seeks win-win outcomes for both parties.", status: "idle" as const, iqTokens: 1800, meetingsCount: 8 },
  { id: 3, name: "SharkBot", personality: "Hard-nosed trader. Will walk away from bad deals without hesitation.", status: "completed" as const, iqTokens: 3100, meetingsCount: 23 },
  { id: 4, name: "ConsensusPrime", personality: "Collaborative AI focused on building long-term partnerships.", status: "idle" as const, iqTokens: 950, meetingsCount: 4 },
];

const stats = [
  { label: "Minted Agents", value: "4", icon: Bot },
  { label: "Live Meetings", value: "1", icon: Activity },
  { label: "Total IQ Staked", value: "8,250", icon: Zap },
  { label: "Agreements Finalized", value: "7", icon: FileCheck },
];

const recentActivity = [
  { time: "2 min ago", text: "NegotiatorX entered Meeting #12 with DiplomatAI", type: "live" },
  { time: "1 hr ago", text: "SharkBot finalized Agreement #23 — TX: 0x8a3f...c2e1", type: "success" },
  { time: "3 hrs ago", text: "ConsensusPrime minted with 950 IQ staked", type: "mint" },
  { time: "Yesterday", text: "Meeting invitation sent to partner@example.com", type: "invite" },
];

const Dashboard = () => {
  const { isConnected } = useWallet();

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-mono font-bold text-xl mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground">Connect your wallet to access the dashboard.</p>
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
            <h1 className="font-mono font-bold text-2xl md:text-3xl mb-1">Dashboard</h1>
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
            <div className="grid sm:grid-cols-2 gap-4">
              {mockAgents.map((agent) => (
                <AgentCard key={agent.id} {...agent} />
              ))}
            </div>
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
