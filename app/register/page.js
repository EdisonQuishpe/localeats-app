"use client";
import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-xl font-bold mb-4">Registro</h1>
        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} className="w-full mb-2 p-2 border rounded" />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full mb-2 p-2 border rounded" />
        <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} className="w-full mb-4 p-2 border rounded" />
        <button className="w-full bg-blue-500 text-white p-2 rounded">Registrar</button>
      </form>
    </div>
  );
}