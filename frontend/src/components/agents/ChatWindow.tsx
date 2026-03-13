import ChatBubble from "./ChatBubble";
import { useEffect, useRef } from "react";

interface Message {
  id: string;
  sender: "agent-a" | "agent-b" | "system";
  senderName: string;
  message: string;
  timestamp: string;
}

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow = ({ messages }: ChatWindowProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto max-h-[60vh]">
      {messages.map((msg) => (
        <ChatBubble key={msg.id} {...msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
