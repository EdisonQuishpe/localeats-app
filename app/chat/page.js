"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Link from "next/link";

let socket;

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket = io();

    socket.on("chat-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();

    if (!message.trim()) {
      alert("Escribe un mensaje");
      return;
    }

    socket.emit("chat-message", message);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Chat LocalEats</h1>

          <Link href="/dashboard" className="text-blue-500 underline">
            Volver
          </Link>
        </div>

        <div className="border rounded p-4 h-80 overflow-y-auto mb-4 bg-gray-50">
          {messages.length === 0 ? (
            <p className="text-gray-500">No hay mensajes todavía</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="mb-2 bg-blue-100 p-2 rounded">
                {msg}
              </div>
            ))
          )}
        </div>

        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}