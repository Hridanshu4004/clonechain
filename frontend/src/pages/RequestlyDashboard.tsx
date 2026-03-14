import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { Activity, DollarSign, Clock, Zap, ArrowUpRight, ArrowDownRight, Wifi, Server, Brain, Bot } from "lucide-react";
import { motion } from "framer-motion";

const mockRequests = [
  { id: 1, method: "POST", endpoint: "/api/v1/chat/completions", status: 200, latency: 342, tokens: 1247, cost: 0.0024, model: "Gemini 1.5", time: "14:01:23" },
  { id: 2, method: "POST", endpoint: "/api/v1/chat/completions", status: 200, latency: 289, tokens: 983, cost: 0.0019, model: "Gemini 1.5", time: "14:01:45" },
  { id: 3, method: "POST", endpoint: "/api/v1/embeddings", status: 200, latency: 156, tokens: 512, cost: 0.0003, model: "Ollama", time: "14:02:01" },
  { id: 4, method: "POST", endpoint: "/api/v1/chat/completions", status: 200, latency: 478, tokens: 2103, cost: 0.0041, model: "Gemini 1.5", time: "14:02:33" },
  { id: 5, method: "POST", endpoint: "/api/v1/chat/completions", status: 200, latency: 312, tokens: 1456, cost: 0.0028, model: "Gemini 1.5", time: "14:03:02" },
  { id: 6, method: "POST", endpoint: "/api/v1/reasoning", status: 200, latency: 567, tokens: 3201, cost: 0.0062, model: "Ollama", time: "14:03:15" },
  { id: 7, method: "PUT", endpoint: "/api/v1/agreement/finalize", status: 200, latency: 2341, tokens: 0, cost: 0.0, model: "—", time: "14:04:01" },
  { id: 8, method: "POST", endpoint: "/api/v1/chat/completions", status: 429, latency: 45, tokens: 0, cost: 0.0, model: "Gemini 1.5", time: "14:04:12" },
];

const RequestlyDashboard = () => {
  const { isConnected } = useWallet();
  // Start with first 3 items safely
  const [requests, setRequests] = useState(() => mockRequests.slice(0, 3));

  //  logic with a real fetch
useEffect(() => {
  const fetchLiveLogs = async () => {
    try {
      // Assuming you have a route to get all meeting messages/logs
      const res = await fetch("/api/meeting/logs"); 
      const data = await res.json();
      setRequests(data);
    } catch (e) {
      console.error("Failed to fetch logs", e);
    }
  };

  fetchLiveLogs();
  const interval = setInterval(fetchLiveLogs, 5000); // Poll every 5 seconds
  return () => clearInterval(interval);
}, []);



  // SAFE CALCULATIONS: Added "r?" to prevent "undefined" crashes
  const totalTokens = requests.reduce((s, r) => s + (r?.tokens || 0), 0);
  const totalCost = requests.reduce((s, r) => s + (r?.cost || 0), 0);
  
  const avgLatency = requests.length > 0 
    ? Math.round(requests.reduce((s, r) => s + (r?.latency || 0), 0) / requests.length) 
    : 0;
    
  const successRate = requests.length > 0 
    ? Math.round((requests.filter((r) => r?.status === 200).length / requests.length) * 100) 
    : 0;

  const stats = [
    { label: "Total Tokens", value: totalTokens.toLocaleString(), icon: Zap, change: "+12%" },
    { label: "API Cost", value: `$${totalCost.toFixed(4)}`, icon: DollarSign, change: "+8%" },
    { label: "Avg Latency", value: `${avgLatency}ms`, icon: Clock, change: "-5%" },
    { label: "Success Rate", value: `${successRate}%`, icon: Activity, change: "0%" },
  ];

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-mono font-bold text-xl mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground">Connect to view the network audit dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="h-6 w-6 text-primary" />
          <h1 className="font-mono font-bold text-2xl md:text-3xl">Requestly Dashboard</h1>
        </div>
        <p className="text-muted-foreground text-sm mb-8">Live monitor of API costs, token usage, and network health. Your secret weapon for judges.</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="rounded-lg border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
                <span className={`text-xs font-mono flex items-center gap-0.5 ${
                  stat.change.startsWith("+") ? "text-primary" : stat.change.startsWith("-") ? "text-accent" : "text-muted-foreground"
                }`}>
                  {stat.change.startsWith("+") ? <ArrowUpRight className="h-3 w-3" /> : stat.change.startsWith("-") ? <ArrowDownRight className="h-3 w-3" /> : null}
                  {stat.change}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="font-mono font-bold text-xl">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-primary animate-pulse" />
              <span className="font-mono text-sm font-medium">Live Network Log</span>
            </div>
            <span className="text-xs text-muted-foreground">{requests.length} requests captured</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="text-left px-4 py-2 font-medium">Time</th>
                  <th className="text-left px-4 py-2 font-medium">Method</th>
                  <th className="text-left px-4 py-2 font-medium">Endpoint</th>
                  <th className="text-left px-4 py-2 font-medium">Model</th>
                  <th className="text-right px-4 py-2 font-medium">Status</th>
                  <th className="text-right px-4 py-2 font-medium">Latency</th>
                  <th className="text-right px-4 py-2 font-medium">Tokens</th>
                  <th className="text-right px-4 py-2 font-medium">Cost</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <motion.tr key={req?.id} initial={{ opacity: 0, backgroundColor: "hsl(174 72% 52% / 0.05)" }}
                    animate={{ opacity: 1, backgroundColor: "transparent" }} transition={{ duration: 0.5 }}
                    className="border-b border-border/50 hover:bg-secondary/50"
                  >
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{req?.time}</td>
                    <td className="px-4 py-2.5">
                      <span className={`font-mono text-xs font-medium px-1.5 py-0.5 rounded ${
                        req?.method === "POST" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                      }`}>{req?.method}</span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs">{req?.endpoint}</td>
                    <td className="px-4 py-2.5">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        {req?.model === "Ollama" ? <Server className="h-3 w-3" /> : req?.model === "—" ? null : <Brain className="h-3 w-3" />}
                        {req?.model}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={`font-mono text-xs ${req?.status === 200 ? "text-primary" : "text-destructive"}`}>{req?.status}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs text-muted-foreground">{req?.latency}ms</td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs">{(req?.tokens ?? 0) > 0 ? req?.tokens.toLocaleString() : "—"}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs text-primary">{(req?.cost ?? 0) > 0 ? `$${req?.cost.toFixed(4)}` : "—"}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
          <Bot className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Why This Matters</p>
            <p className="text-xs text-muted-foreground mt-1">
              This dashboard turns hidden AI conversations into a visible, audited business process. It calculates meeting costs and proves that the AI is actually reasoning before it acts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestlyDashboard;