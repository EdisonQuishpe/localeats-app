"use client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../components/ThemeProvider";
import { ProtectedRoute, useAuth } from "../components/AuthProvider";
import { api } from "../lib/api";

let socket;

function ChatContent() {
  const { t } = useTheme();
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket = io();
    socket.on("connect", () => {
      setConnected(true);
      const savedConversationId = localStorage.getItem("conversationId");
      if (savedConversationId) {
        setConversationId(savedConversationId);
        socket.emit("join-conversation", savedConversationId);
        // Gateway: la conversacion incluye sus mensajes
        api.get(`/support/conversations/${savedConversationId}`)
          .then((data) => {
            if (data && Array.isArray(data.messages)) setMessages(data.messages);
          })
          .catch(() => {});
      }
    });
    socket.on("disconnect", () => setConnected(false));
    socket.on("support-message", (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });
    return () => { socket.disconnect(); };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createConversation = async (e) => {
    e.preventDefault();
    if (!subject.trim()) return;
    try {
      // Gateway: POST /support/conversations -> conversacion creada
      const data = await api.post("/support/conversations", {
        subject,
        userId: user?.id,
      });
      if (data && data.id) {
        const newId = data.id.toString();
        setConversationId(newId);
        localStorage.setItem("conversationId", newId);
        socket.emit("join-conversation", newId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !conversationId || !user?.id) return;
    try {
      // Gateway: POST /support/messages -> mensaje creado
      const data = await api.post("/support/messages", {
        content: message,
        senderRole: "user",
        conversationId: Number(conversationId),
        userId: user.id,
      });
      if (data && data.id) {
        socket.emit("support-message", { conversationId, message: data });
        setMessage("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetConversation = () => {
    localStorage.removeItem("conversationId");
    setConversationId(null);
    setMessages([]);
    setSubject("");
    setMessage("");
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[20%] left-[5%] w-80 h-80 rounded-full blur-[120px]"
          style={{ background: "var(--brand-glow)" }}
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <div>
            <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)" }}>
              💬 {t("chatTitle")}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`w-2 h-2 rounded-full ${connected ? "animate-pulse" : ""}`}
                style={{ background: connected ? "var(--success)" : "var(--error)" }}
              />
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                {connected ? t("connected") : t("disconnected")}
              </span>
            </div>
          </div>
          <Link href="/dashboard" className="text-sm font-medium" style={{ color: "var(--brand)" }}>
            ← {t("back")}
          </Link>
        </motion.div>

        {/* Info bar */}
        <div className="mb-4 flex flex-wrap gap-2 items-center">
          <span
            className="px-3 py-1.5 rounded-lg text-sm"
            style={{ background: "var(--surface-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
          >
            {user?.name || t("yourName")}
          </span>
          {conversationId && (
            <>
              <span
                className="px-3 py-1.5 rounded-lg text-sm"
                style={{ background: "var(--surface-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
              >
                #{conversationId}
              </span>
              <button
                onClick={resetConversation}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                style={{ background: "rgba(239,68,68,0.1)", color: "var(--error)", border: "1px solid rgba(239,68,68,0.2)" }}
              >
                {t("newConversation")}
              </button>
            </>
          )}
        </div>

        {/* Create conversation */}
        {!conversationId && (
          <motion.form
            onSubmit={createConversation}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex gap-3"
          >
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t("subject")}
              className="input-field flex-1"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn-primary"
            >
              {t("create")}
            </motion.button>
          </motion.form>
        )}

        {/* Messages area */}
        <div className="glass-card flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 space-y-3" style={{ minHeight: "360px" }}>
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p style={{ color: "var(--text-muted)" }}>{t("noMessages")}</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  const isSupport = msg.senderRole === "support";
                  const isOwn = msg.senderRole === "user" && msg.userId === user?.id;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className="max-w-[75%] px-4 py-3 rounded-2xl text-sm"
                        style={
                          isOwn
                            ? { background: "var(--brand)", color: "white", borderBottomRightRadius: "4px" }
                            : { background: "var(--surface-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)", borderBottomLeftRadius: "4px" }
                        }
                      >
                        <p className="font-semibold text-[11px] mb-1 opacity-80">
                          {isSupport ? t("supportTitle") : (msg.user?.name || user?.name)}
                        </p>
                        <p>{msg.content}</p>
                        {msg.createdAt && (
                          <p className="text-[10px] mt-1 opacity-60">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="flex gap-3 p-4"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("typeMessage")}
              className="input-field flex-1"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn-primary"
            >
              {t("send")}
            </motion.button>
          </form>
        </div>
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
