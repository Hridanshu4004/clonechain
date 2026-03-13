import { Bot, User } from "lucide-react";

interface ChatBubbleProps {
  sender: "agent-a" | "agent-b" | "system";
  senderName: string;
  message: string;
  timestamp: string;
}

const ChatBubble = ({ sender, senderName, message, timestamp }: ChatBubbleProps) => {
  const isSystem = sender === "system";
  const isAgentA = sender === "agent-a";

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <span className="rounded-full bg-secondary px-4 py-1.5 text-xs text-muted-foreground font-mono">
          {message}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${isAgentA ? "" : "flex-row-reverse"}`}>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isAgentA ? "bg-primary/20" : "bg-accent/20"}`}>
        <Bot className={`h-4 w-4 ${isAgentA ? "text-primary" : "text-accent"}`} />
      </div>
      <div className={`max-w-[75%] ${isAgentA ? "" : "text-right"}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-mono font-medium ${isAgentA ? "text-primary" : "text-accent"}`}>{senderName}</span>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>
        <div className={`rounded-lg px-4 py-2.5 text-sm ${isAgentA ? "bg-secondary text-foreground" : "bg-secondary text-foreground"}`}>
          {message}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
