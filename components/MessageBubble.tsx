type Message = {
  id: number;
  text: string;
  sender: string;
  time: string;
};

const COLORS = ["#7c5cfc","#0f6e56","#993c1d","#185fa5","#993556","#3b6d11"];

function getColor(name: string) {
  let hash = 0;
  for (let c of name) hash += c.charCodeAt(0);
  return COLORS[hash % COLORS.length];
}

export default function MessageBubble({ msg, username }: { msg: Message; username: string }) {
  const isMe = msg.sender === username;
  const isSystem = msg.sender === "system";
  const isAI = msg.sender === "NexAI";

  if (isSystem) return (
    <div className="text-center text-xs text-gray-500 py-1">
      — {msg.text} —
    </div>
  );

  return (
    <div className={`flex gap-2 md:gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
      <div
        className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs md:text-sm font-bold text-white flex-shrink-0"
        style={{ background: isAI ? "#185fa5" : getColor(msg.sender) }}
      >
        {msg.sender === "NexAI" ? "🤖" : msg.sender.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
      </div>
      <div className={`max-w-[70%] md:max-w-sm flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
        <div className="text-xs text-gray-400">
          {msg.sender} · {msg.time}
        </div>
        <div className={`px-3 md:px-4 py-2 rounded-2xl text-sm leading-relaxed break-words ${
          isMe
            ? "bg-purple-600 text-white rounded-tr-sm"
            : isAI
            ? "bg-blue-900 border border-blue-700 rounded-tl-sm"
            : "bg-gray-800 rounded-tl-sm"
        }`}>
          {msg.text}
        </div>
      </div>
    </div>
  );
}