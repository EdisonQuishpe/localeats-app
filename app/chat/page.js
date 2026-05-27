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

  const [subject, setSubject] = useState("");
  const [conversationId, setConversationId] = useState(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("Usuario");
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

        fetch(`/api/messages?conversationId=${savedConversationId}`)
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) {
              setMessages(data);
            }
          });
      }
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("support-message", (msg) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === msg.id);
        if (exists) return prev;

        return [...prev, msg];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createConversation = async (e) => {
    e.preventDefault();

    if (!subject.trim()) {
      alert("Escribe el asunto de soporte");
      return;
    }

    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subject }),
    });

    const data = await res.json();

    if (data.conversation) {
      const newConversationId = data.conversation.id.toString();

      setConversationId(newConversationId);
      localStorage.setItem("conversationId", newConversationId);

      socket.emit("join-conversation", newConversationId);

      alert(`Conversación #${newConversationId} creada`);
    } else {
      alert(data.error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      alert("Escribe un mensaje");
      return;
    }

    if (!conversationId) {
      alert("Primero crea una conversación");
      return;
    }

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message,
        senderRole: "user",
        conversationId,
      }),
    });

    const data = await res.json();

    if (data.data) {
      socket.emit("support-message", {
        conversationId,
        message: data.data,
      });

      setMessage("");
    } else {
      alert(data.error);
    }
  };

  const resetConversation = () => {
    const confirmReset = confirm(
      "¿Quieres iniciar una nueva conversación de soporte?"
    );

    if (!confirmReset) return;

    localStorage.removeItem("conversationId");
    setConversationId(null);
    setMessages([]);
    setSubject("");
    setMessage("");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <div>
            <h1 className="text-3xl font-black text-white">
              Soporte LocalEats
            </h1>

            <div className="flex items-center gap-2 mt-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  connected ? "bg-green-400 animate-pulse" : "bg-red-400"
                }`}
              />

              <span className="text-sm text-zinc-500">
                {connected ? "Conectado" : "Desconectado"}
              </span>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
          >
            ← Volver
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 flex gap-3 items-center"
        >
          <input
            placeholder="Tu nombre"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-2 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all w-48"
          />

          {conversationId && (
            <div className="px-4 py-2 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white text-sm">
              Conversación #{conversationId}
            </div>
          )}

          {conversationId && (
            <button
              onClick={resetConversation}
              className="px-4 py-2 rounded-xl bg-red-500/80 text-white text-sm hover:bg-red-600 transition"
            >
              Nueva conversación
            </button>
          )}
        </motion.div>

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
              placeholder="Asunto de soporte"
              className="flex-1 px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
            />

            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-xl font-bold"
            >
              Iniciar
            </button>
          </motion.form>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md overflow-hidden"
        >
          <div className="h-96 overflow-y-auto p-6 space-y-3">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-zinc-600 text-sm">
                  No hay mensajes todavía
                </p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  const isSupport = msg.senderRole === "support";

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${
                        isSupport ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                          isSupport
                            ? "bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-bl-sm"
                            : "bg-linear-to-r from-orange-500 to-red-500 text-white rounded-br-sm"
                        }`}
                      >
                        <p className="font-bold mb-1">
                          {isSupport ? "Soporte" : username}
                        </p>

                        <p>{msg.content}</p>

                        {msg.createdAt && (
                          <p className="text-[10px] opacity-70 mt-1">
                            {new Date(msg.createdAt).toLocaleString()}
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

          <form
            onSubmit={sendMessage}
            className="flex gap-3 p-4 border-t border-zinc-800"
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-6 py-3 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all"
            >
              Enviar
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