"use client";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import InputBar from "../components/InputBar";

type Message = {
  id: number;
  text: string;
  sender: string;
  time: string;
  readBy?: string[];
  edited?: boolean;
  reactions?:{ [emoji: string]: string[] };
};

type OnlineUser = {
  username: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [typing, setTyping] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [connected, setConnected] = useState(false);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:3001", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected!", socket.id);
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected!");
      setConnected(false);
    });

    socket.on("receive_message", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on("message_history", (history) => {
      setMessages(history);
    });

    socket.on("message_read", ({ messageId, username: readUsername }) => {
      setMessages(prev => prev.map(msg =>
        msg.id === messageId && !(msg.readBy || []).includes(readUsername)
          ? { ...msg, readBy: [...(msg.readBy || []), readUsername] }
          : msg
      ));
    });

    socket.on("delete_message", (messageID) => {
      setMessages(prev => prev.filter(msg => msg.id !== messageID));
    });
    socket.on("edit_message", ({ messageId, newText }) => {
  setMessages(prev => prev.map(msg =>
    msg.id === messageId ? { ...msg, text: newText, edited: true } : msg
  ));
  });

  socket.on("update_reaction", ({ messageId, reactions }) => {
    setMessages(prev => prev.map(msg => msg.id === messageId ? {...msg, reactions} : msg));
  })

    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    socket.on("user_typing", (name) => {
      setTyping(name + " typing...");
    });

    socket.on("stop_typing", () => setTyping(""));

    return () => {
      socket.disconnect();
    };
  }, []);

  const readMessages = useRef<Set<number>>(new Set());

useEffect(() => {
  if (!joined || !socketRef.current) return;
  messages.forEach(msg => {
    if (
      msg.sender !== username &&
      !readMessages.current.has(msg.id)
    ) {
      readMessages.current.add(msg.id);
      socketRef.current?.emit("message_read", {
        messageId: msg.id,
        username
      });
    }
  });
}, [messages, joined]);

  const handleJoin = () => {
    if (!nameInput.trim() || !socketRef.current) return;
    setUsername(nameInput.trim());
    socketRef.current.emit("user_join", { username: nameInput.trim() });
    setJoined(true);
  };

  const handleTyping = () => {
    if (!socketRef.current) return;
    socketRef.current.emit("typing", username);
    clearTimeout(typingTimeout.current ?? undefined);
    typingTimeout.current = setTimeout(() => {
      socketRef.current?.emit("stop_typing");
    }, 1500);
  };

  const sendMessage = async () => {
    if (!input.trim() || !socketRef.current) return;
    const text = input.trim();
    setInput("");
    socketRef.current.emit("stop_typing");

    const msg: Message = {
      id: Date.now(),
      text,
      sender: username,
      time: new Date().toLocaleTimeString("en-US")
    };
    socketRef.current.emit("send_message", msg);

    if (text.toLowerCase().includes("@ai")) {
      const query = text.replace(/@ai/gi, "").trim() || text;
      setAiLoading(true);
      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: query })
        });
        const data = await res.json();
        const aiMsg: Message = {
          id: Date.now() + 1,
          text: data.reply,
          sender: "NexAI",
          time: new Date().toLocaleTimeString("en-US")
        };
        socketRef.current.emit("send_message", aiMsg);
      } catch {
        console.error("AI error");
      } finally {
        setAiLoading(false);
      }
    }
  };
  const deleteMessage = (messageId: number) =>{
    socketRef.current?.emit("delete_message", messageId);
  }

  const editMessage = (messageId: number, newText: string) => {
    socketRef.current?.emit("edit_message", {messageId, newText});
  };
  const reactMessage = (messageId: number, emoji: string) => {
  const msg = messages.find(m => m.id === messageId);
  const hasReacted = msg?.reactions?.[emoji]?.includes(username);
  if (hasReacted) {
    socketRef.current?.emit("remove_reaction", { messageId, emoji, username });
  } else {
    socketRef.current?.emit("add_reaction", { messageId, emoji, username });
  }
};

  if (!joined) {
    return (
      <main className="flex items-center justify-center h-screen bg-gray-950">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-80 flex flex-col gap-4">
          <div className="text-center">
            <div className="text-4xl mb-2">💬</div>
            <h1 className="text-white font-bold text-xl">AI Messenger</h1>
            <p className="text-gray-400 text-sm mt-1">Enter Your Name</p>
          </div>
          <div className={`text-xs text-center py-1 rounded-lg ${connected ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"}`}>
            {connected ? "✅ Server connected" : "⏳ Connecting to server..."}
          </div>
          <input
            className="bg-gray-800 text-white rounded-xl px-4 py-3 outline-none text-sm"
            placeholder="ex: John, Jane..."
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleJoin()}
            autoFocus
          />
          <button
            onClick={handleJoin}
            disabled={!connected}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl py-3 font-bold text-sm transition"
          >
            Connect to chat →
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-screen bg-gray-950 text-white">
      <Sidebar onlineUsers={onlineUsers} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatWindow
          messages={messages}
          username={username}
          typing={typing}
          aiLoading={aiLoading}
          onDelete={deleteMessage}
          onEdit = {editMessage}
          onReact={reactMessage}
        />
        <InputBar
          input={input}
          setInput={setInput}
          onSend={sendMessage}
          onTyping={handleTyping}
        />
      </div>
    </main>
  );
}