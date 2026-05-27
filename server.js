const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("Usuario conectado:", socket.id);

    socket.on("join-conversation", (conversationId) => {
      socket.join(`conversation-${conversationId}`);
      console.log(`Socket ${socket.id} unido a conversación ${conversationId}`);
    });

    socket.on("support-message", ({ conversationId, message }) => {
      io.to(`conversation-${conversationId}`).emit("support-message", message);
    });

    socket.on("disconnect", () => {
      console.log("Usuario desconectado:", socket.id);
    });
  });

  server.listen(3000, () => {
    console.log("Servidor listo en http://localhost:3000");
  });
});