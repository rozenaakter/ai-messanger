import { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";

type Message = {
  id: number;
  text: string;
  sender: string;
  avatar: string;
  time: string;
};

type Props = {
  messages: Message[];
  username: string;
  typing: string;
  aiLoading: boolean;
};

export default function ChatWindow({ messages, username, typing, aiLoading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
        <div>
          <div className="font-bold"># general</div>
          <div className="text-xs text-gray-400">@ai লিখে AI কে জিজ্ঞেস করুন</div>
        </div>
        <div className="text-sm text-purple-400 h-5 text-right">
          {aiLoading ? "🤖 AI ভাবছে..." : typing}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-600 text-sm mt-10">
            কোনো মেসেজ নেই। প্রথম মেসেজ পাঠান! 👋
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} username={username} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}