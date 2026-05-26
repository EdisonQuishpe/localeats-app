"use client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../components/ThemeProvider";
import { ProtectedRoute } from "../components/AuthProvider";

let socket;

function ChatContent() {
  const { t } = useTheme();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("Usuario");
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket = io();
    socket.on("connect", () => setConnected(true));
    socket.on("chat-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on("disconnect", () => setConnected(false));
    return () => { socket.disconnect(); };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit("chat-message", `${username}: ${message}`);
    setMessage("");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-[20%] left-[5%] w-80 h-80 rounded-full bg-green-500/5 blur-[100px]"
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[10%] w-64 h-64 rounded-full bg-blue-500/5 blur-[80px]"
          animate={{ x: [0, -15, 0], y: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <div>
            <h1 className="text-3xl font-black text-white">💬 {t("chatTitle")}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
              <span className="text-sm text-zinc-500">
                {connected ? t("connected") : t("disconnected")}
              </span>
            </div>
          </div>
          <Link href="/dashboard" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
            ← {t("back")}
          </Link>
        </motion.div>

        {/* Username input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <input
            placeholder={t("yourName")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-2 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all w-48"
          />
        </motion.div>

        {/* Chat container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md overflow-hidden"
        >
          {/* Messages area */}
          <div className="h-96 overflow-y-auto p-6 space-y-3">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-zinc-600 text-sm">{t("noMessages")}</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => {
                  const isOwn = msg.startsWith(`${username}:`);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                          isOwn
                            ? "bg-linear-to-r from-orange-500 to-red-500 text-white rounded-br-sm"
                            : "bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-bl-sm"
                        }`}
                      >
                        {msg}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <form onSubmit={sendMessage} className="flex gap-3 p-4 border-t border-zinc-800">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("typeMessage")}
              className="flex-1 px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-6 py-3 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all"
            >
              {t("send")}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatContent />
    </ProtectedRoute>
  );
}