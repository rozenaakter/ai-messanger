"use client";
import { useState } from "react";

type Reactions = {
  [emoji: string]: string[];
};

type Message = {
  id: number;
  text: string;
  sender: string;
  time: string;
  readBy?: string[];
  edited?: boolean;
  reactions?: Reactions;
};

const COLORS = ["#7c5cfc","#0f6e56","#993c1d","#185fa5","#993556","#3b6d11"];
const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

function getColor(name: string) {
  let hash = 0;
  for (let c of name) hash += c.charCodeAt(0);
  return COLORS[hash % COLORS.length];
}

type Props = {
  msg: Message;
  username: string;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
  onReact: (messageId: number, emoji: string) => void;
};

export default function MessageBubble({ msg, username, onDelete, onEdit, onReact }: Props) {
  const isMe = msg.sender === username;
  const isSystem = msg.sender === "system";
  const isAI = msg.sender === "NexAI";
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(msg.text);
  const [showEmoji, setShowEmoji] = useState(false);

  if (isSystem) return (
    <div className="text-center text-xs text-gray-500 py-1">
      — {msg.text} —
    </div>
  );

  return (
    <div
      className={`flex gap-2 md:gap-3 ${isMe ? "flex-row-reverse" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowEmoji(false); }}
    >
      <div
        className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs md:text-sm font-bold text-white flex-shrink-0"
        style={{ background: isAI ? "#185fa5" : getColor(msg.sender) }}
      >
        {msg.sender === "NexAI" ? "🤖" : msg.sender.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
      </div>

      <div className={`max-w-[70%] md:max-w-sm flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
        <div className="text-xs text-gray-400">
          {msg.sender} · {msg.time} {msg.edited && <span className="text-gray-500">(edited)</span>}
        </div>

        {editing ? (
          <div className="flex gap-2">
            <input
              className="bg-gray-700 text-white px-3 py-1 rounded-xl text-sm outline-none"
              value={editText}
              onChange={e => setEditText(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") { onEdit(msg.id, editText); setEditing(false); }
                if (e.key === "Escape") setEditing(false);
              }}
              autoFocus
            />
            <button
              onClick={() => { onEdit(msg.id, editText); setEditing(false); }}
              className="text-xs bg-purple-600 px-2 py-1 rounded-lg text-white"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-xs bg-gray-600 px-2 py-1 rounded-lg text-white"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className={`px-3 md:px-4 py-2 rounded-2xl text-sm leading-relaxed break-words ${
            isMe
              ? "bg-purple-600 text-white rounded-tr-sm"
              : isAI
              ? "bg-blue-900 border border-blue-700 rounded-tl-sm"
              : "bg-gray-800 rounded-tl-sm"
          }`}>
            {msg.text}
          </div>
        )}

        {/* Reactions */}
        {msg.reactions && Object.keys(msg.reactions).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {Object.entries(msg.reactions).map(([emoji, users]) =>
              users.length > 0 && (
                <button
                  key={emoji}
                  onClick={() => onReact(msg.id, emoji)}
                  className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 transition ${
                    users.includes(username)
                      ? "bg-purple-600 border-purple-500 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500"
                  }`}
                >
                  {emoji} {users.length}
                </button>
              )
            )}
          </div>
        )}

        {/* Emoji picker */}
        {showEmoji && (
          <div className="flex gap-1 bg-gray-800 border border-gray-700 rounded-xl px-2 py-1 mt-1">
            {EMOJIS.map(emoji => (
              <button
                key={emoji}
                onClick={() => { onReact(msg.id, emoji); setShowEmoji(false); }}
                className="text-sm hover:scale-125 transition"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Edit/Delete/React buttons */}
        {hovered && !editing && (
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => setShowEmoji(!showEmoji)}
              className="text-xs text-gray-400 hover:text-white"
            >
              😊 React
            </button>
            {isMe && (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => onDelete(msg.id)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  🗑️ Delete
                </button>
              </>
            )}
          </div>
        )}

        {isMe && msg.readBy && msg.readBy.length > 0 && (
          <div className="text-xs text-blue-400 mt-1">
            ✓✓ seen by {msg.readBy.join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}