"use client";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "../../components/ThemeProvider";
import { ProtectedRoute, useAuth } from "../../components/AuthProvider";

let socket;

function SupportDetailContent() {
  const params = useParams();
  const conversationId = params.id;
  const { t } = useTheme();
  const { user } = useAuth();
  const [conversation, setConversation] = useState(null);
  const [reply, setReply] = useState("");
  const messagesEnd = useRef(null);

  const fetchConversation = async () => {
    const res = await fetch(`/api/conversations/${conversationId}`);
    const data = await res.json();
    setConversation(data);
  };

  useEffect(() => {
    socket = io();
    socket.emit("join-conversation", conversationId);
    socket.on("support-message", (message) => {
      setConversation((prev) => {
        if (!prev) return prev;
        const exists = prev.messages.some((m) => m.id === message.id);
        if (exists) return prev;
        return { ...prev, messages: [...prev.messages, message] };
      });
    });
    fetchConversation();
    return () => { socket.disconnect(); };
  }, [conversationId]);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  const sendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;

    const senderRole = user?.role === "support" || user?.role === "admin" ? "support" : "user";
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: reply,
        senderRole,
        conversationId,
        userId: user?.id,
      }),
    });
    const data = await res.json();
    if (data.data) {
      socket.emit("support-message", { conversationId, message: data.data });
      setReply("");
    }
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "var(--brand)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Header */}
      <div
        className="sticky top-14 z-40 px-4 sm:px-6 py-4 backdrop-blur-xl"
        style={{ background: "var(--glass-bg)", borderBottom: "1px solid var(--glass-border)" }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/support" className="text-sm font-medium" style={{ color: "var(--brand)" }}>
              ← {t("back")}
            </Link>
            <div>
              <h1 className="font-bold" style={{ color: "var(--text-primary)" }}>
                #{conversation.id} — {conversation.subject}
              </h1>
              <span
                className="badge text-[10px]"
                style={
                  conversation.status === "open"
                    ? { color: "var(--success)", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }
                    : { color: "var(--text-muted)", background: "var(--surface-secondary)", border: "1px solid var(--border)" }
                }
              >
                {conversation.status === "open" ? t("openTicket") : t("closedTicket")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-3">
          {conversation.messages.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl block mb-3">💬</span>
              <p style={{ color: "var(--text-muted)" }}>{t("noMessages")}</p>
            </div>
          ) : (
            conversation.messages.map((msg, idx) => {
              const isSupport = msg.senderRole === "support";
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`flex ${isSupport ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[75%] px-4 py-3 rounded-2xl"
                    style={
                      isSupport
                        ? {
                            background: "var(--brand)",
                            color: "white",
                            borderBottomRightRadius: "4px",
                          }
                        : {
                            background: "var(--surface-secondary)",
                            color: "var(--text-primary)",
                            border: "1px solid var(--border)",
                            borderBottomLeftRadius: "4px",
                          }
                    }
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className="text-[10px] mt-1 opacity-70"
                      style={{ color: isSupport ? "rgba(255,255,255,0.7)" : "var(--text-muted)" }}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
          <div ref={messagesEnd} />
        </div>
      </div>

      {/* Input */}
      <div
        className="sticky bottom-0 px-4 sm:px-6 py-4 backdrop-blur-xl"
        style={{ background: "var(--glass-bg)", borderTop: "1px solid var(--glass-border)" }}
      >
        <form onSubmit={sendReply} className="max-w-3xl mx-auto flex gap-3">
          <input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
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
  );
}

export default function SupportDetailPage() {
  return (
    <ProtectedRoute>
      <SupportDetailContent />
    </ProtectedRoute>
  );
}
