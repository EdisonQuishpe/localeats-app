import { Server } from "socket.io";

let io;

export function initSocket(server) {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("Usuario conectado:", socket.id);

      socket.on("chat-message", (message) => {
        io.emit("chat-message", message);
      });

      socket.on("disconnect", () => {
        console.log("Usuario desconectado:", socket.id);
      });
    });
  }

  return io;
}