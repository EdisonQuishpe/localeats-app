"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "../components/AuthProvider";

export default function SupportPage() {
  const [conversations, setConversations] = useState([]);

  const fetchConversations = async () => {
    const res = await fetch("/api/conversations");
    const data = await res.json();
    setConversations(data);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">
          Conversaciones de Soporte
        </h1>

      {conversations.length === 0 ? (
        <p>No hay conversaciones registradas.</p>
      ) : (
        conversations.map((conversation) => (
          <div
            key={conversation.id}
            className="border p-4 rounded mb-3"
          >
            <h2 className="font-bold">
              #{conversation.id} - {conversation.subject}
            </h2>

            <p>Estado: {conversation.status}</p>
            <p>Mensajes: {conversation.messages.length}</p>

            <Link
              href={`/support/${conversation.id}`}
              className="text-blue-500 underline"
            >
              Ver conversación
            </Link>
          </div>
        ))
      )}
      </div>
    </ProtectedRoute>
  );
}