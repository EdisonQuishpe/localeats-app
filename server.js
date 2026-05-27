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

  // Track which users are connected and their socket IDs
  const userSockets = new Map(); // userId -> Set of socket ids

  io.on("connection", (socket) => {
    console.log("Usuario conectado:", socket.id);

    // User registers their userId for push notifications
    socket.on("register-user", (userId) => {
      if (!userId) return;
      const uid = String(userId);
      if (!userSockets.has(uid)) {
        userSockets.set(uid, new Set());
      }
      userSockets.get(uid).add(socket.id);
      socket.userId = uid;
      console.log(`User ${uid} registered socket ${socket.id}`);
    });

    socket.on("join-conversation", (conversationId) => {
      socket.join(`conversation-${conversationId}`);
      console.log(`Socket ${socket.id} unido a conversación ${conversationId}`);
    });

    socket.on("support-message", ({ conversationId, message }) => {
      io.to(`conversation-${conversationId}`).emit("support-message", message);
    });

    // Push notification to specific user(s)
    socket.on("send-notification", ({ targetUserIds, notification }) => {
      if (!targetUserIds || !notification) return;
      const targets = Array.isArray(targetUserIds) ? targetUserIds : [targetUserIds];
      targets.forEach((uid) => {
        const sockets = userSockets.get(String(uid));
        if (sockets) {
          sockets.forEach((sid) => {
            io.to(sid).emit("new-notification", notification);
          });
        }
      });
    });

    socket.on("disconnect", () => {
      // Clean up user mapping
      if (socket.userId && userSockets.has(socket.userId)) {
        userSockets.get(socket.userId).delete(socket.id);
        if (userSockets.get(socket.userId).size === 0) {
          userSockets.delete(socket.userId);
        }
      }
      console.log("Usuario desconectado:", socket.id);
    });
  });

  // Expose io for API routes to use (via global)
  global.io = io;
  global.userSockets = userSockets;

  server.listen(3000, () => {
    console.log("Servidor listo en http://localhost:3000");
  });
});