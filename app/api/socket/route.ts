import { Server } from "socket.io";
import { NextResponse } from "next/server";

const globalAny = global as any;

export async function GET(req: Request) {
  if (globalAny.io) {
    return NextResponse.json({ message: "Already running" });
  }

  const httpServer = (globalAny as any).httpServer;

  const io = new Server(httpServer, {
    cors: { origin: "*" },
    path: "/api/socket"
  });

  globalAny.io = io;

  const onlineUsers: Record<string, { username: string; avatar: string }> = {};
  const messages: any[] = [];

  io.on("connection", (socket) => {
    socket.on("user_join", ({ username, avatar }: { username: string; avatar: string }) => {
      onlineUsers[socket.id] = { username, avatar };
      socket.emit("message_history", messages);
      io.emit("online_users", Object.values(onlineUsers));
      io.emit("receive_message", {
        id: Date.now(),
        text: `${username} join..! 👋`,
        sender: "system",
        time: new Date().toLocaleTimeString("bn-BD")
      });
    });

    socket.on("send_message", (data: any) => {
      messages.push(data);
      if (messages.length > 100) messages.shift();
      io.emit("receive_message", data);
    });

    socket.on("typing", (username: string) => {
      socket.broadcast.emit("user_typing", username);
    });

    socket.on("stop_typing", () => {
      socket.broadcast.emit("stop_typing");
    });

    socket.on("disconnect", () => {
      const user = onlineUsers[socket.id];
      if (user) {
        delete onlineUsers[socket.id];
        io.emit("online_users", Object.values(onlineUsers));
        io.emit("receive_message", {
          id: Date.now(),
          text: `${user.username} left..!`,
          sender: "system",
          time: new Date().toLocaleTimeString("bn-BD")
        });
      }
    });
  });

  return NextResponse.json({ message: "Socket started" });
}