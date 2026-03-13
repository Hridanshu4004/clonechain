import { Bot, Zap, Circle } from "lucide-react";
import { Link } from "react-router-dom";

interface AgentCardProps {
  id: number;
  name: string;
  personality: string;
  status: "idle" | "live" | "completed";
  iqTokens: number;
  meetingsCount: number;
}

const statusConfig = {
  idle: { label: "Idle", className: "bg-muted text-muted-foreground" },
  live: { label: "Live", className: "gradient-primary-bg text-primary-foreground animate-pulse-glow" },
  completed: { label: "Completed", className: "bg-secondary text-secondary-foreground" },
};

const AgentCard = ({ id, name, personality, status, iqTokens, meetingsCount }: AgentCardProps) => {
  const s = statusConfig[status];

  return (
    <Link
      to={status === "live" ? `/meeting/${id}` : "#"}
      className="group block rounded-lg border border-border bg-card p-5 transition-all hover:glow-border"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.className}`}>
          {status === "live" && <Circle className="h-2 w-2 fill-current" />}
          {s.label}
        </span>
      </div>

      <h3 className="font-mono font-semibold text-foreground mb-1">{name}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{personality}</p>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Zap className="h-3 w-3 text-primary" />
          {iqTokens} IQ
        </span>
        <span>{meetingsCount} meetings</span>
      </div>
    </Link>
  );
};

export default AgentCard;
