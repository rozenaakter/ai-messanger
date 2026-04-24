import { io, Socket } from "socket.io-client";

let socket: Socket;

if (typeof window !== "undefined") {
  socket = io("http://localhost:3001", {
    reconnection: false,
    transports: ["websocket"],
    autoConnect: true,
  });
}

export default socket!;