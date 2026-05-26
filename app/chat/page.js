"use client";
import Link from "next/link";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Chat LocalEats</h1>
          <Link href="/dashboard" className="text-blue-500 underline text-sm">Volver</Link>
        </div>
        <div className="border rounded p-4 h-72 bg-gray-50 mb-4">
          <p className="text-gray-400 text-sm">No hay mensajes todavía...</p>
        </div>
        <div className="flex gap-2">
          <input placeholder="Escribe un mensaje..." className="flex-1 border p-2 rounded" />
          <button className="bg-green-500 text-white px-4 py-2 rounded">Enviar</button>
        </div>
      </div>
    </div>
  );
}