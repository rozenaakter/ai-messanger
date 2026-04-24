"use client";
import { useState } from "react";

type OnlineUser = {
  username: string;
};

const COLORS = ["#7c5cfc","#0f6e56","#993c1d","#185fa5","#993556","#3b6d11"];

function getColor(name: string) {
  let hash = 0;
  for (let c of name) hash += c.charCodeAt(0);
  return COLORS[hash % COLORS.length];
}

export default function Sidebar({ onlineUsers }: { onlineUsers: OnlineUser[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-lg text-white"
        onClick={() => setOpen(!open)}
      >
        {open ? "✕" : "☰"}
      </button>

      {/* Overlay - mobile only */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-40
        w-56 bg-gray-900 border-r border-gray-800
        flex flex-col p-4 gap-3
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="font-bold text-lg flex items-center gap-2 mt-8 md:mt-0">
          <span>💬</span> AI Messenger
        </div>
        <div className="text-xs text-gray-500 uppercase tracking-widest mt-2">
          Online — {onlineUsers.length}
        </div>
        {onlineUsers.map((u, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: getColor(u.username) }}
            >
              {u.username.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <span className="text-sm text-gray-300 truncate">{u.username}</span>
            <span className="ml-auto w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
          </div>
        ))}
      </div>
    </>
  );
}