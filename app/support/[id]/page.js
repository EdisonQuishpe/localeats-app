"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "next/navigation";
import Link from "next/link";

let socket;

export default function SupportDetailPage() {
  const params = useParams();
  const conversationId = params.id;

  const [conversation, setConversation] = useState(null);
  const [reply, setReply] = useState("");

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

        return {
          ...prev,
          messages: [...prev.messages, message],
        };
      });
    });

    fetchConversation();

    return () => {
      socket.disconnect();
    };
  }, [conversationId]);

  const sendReply = async (e) => {
    e.preventDefault();

    if (!reply.trim()) {
      alert("Escribe una respuesta");
      return;
    }

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: reply,
        senderRole: "support",
        conversationId,
      }),
    });

    const data = await res.json();

    if (data.data) {
      socket.emit("support-message", {
        conversationId,
        message: data.data,
      });

      setReply("");
    }
  };

  if (!conversation) {
    return <p className="p-6">Cargando conversación...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <Link href="/support" className="text-blue-500 underline">
          Volver a soporte
        </Link>

        <h1 className="text-2xl font-bold mt-4">
          Conversación #{conversation.id}
        </h1>

        <p className="mb-2">Asunto: {conversation.subject}</p>
        <p className="mb-4">Estado: {conversation.status}</p>

        <div className="border rounded p-4 mb-4 h-96 overflow-y-auto bg-gray-50">
          {conversation.messages.length === 0 ? (
            <p className="text-gray-500">No hay mensajes todavía.</p>
          ) : (
            conversation.messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 mb-2 rounded ${
                  msg.senderRole === "support"
                    ? "bg-green-100 ml-12"
                    : "bg-blue-100 mr-12"
                }`}
              >
                <p className="font-bold">
                  {msg.senderRole === "support" ? "Soporte" : "Usuario"}
                </p>
                <p>{msg.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={sendReply} className="flex gap-2">
          <input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Responder como soporte..."
            className="border p-2 flex-1 rounded"
          />

          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Responder
          </button>
        </form>
      </div>
    </div>
  );
}