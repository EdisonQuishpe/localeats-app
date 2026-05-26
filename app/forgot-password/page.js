"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  const [form, setForm] = useState({ email: "", newPassword: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-xl font-bold mb-4">Recuperar contraseña</h1>
        <input type="email" name="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} className="w-full mb-2 p-2 border rounded" />
        <input type="password" name="newPassword" placeholder="Nueva contraseña" value={form.newPassword} onChange={handleChange} className="w-full mb-4 p-2 border rounded" />
        <button className="w-full bg-blue-500 text-white p-2 rounded">Cambiar contraseña</button>
        <p className="mt-4 text-sm text-center">
          <Link href="/login" className="text-blue-500 underline">Volver al login</Link>
        </p>
      </form>
    </div>
  );
}