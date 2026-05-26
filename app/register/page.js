"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Completa todos los campos");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (data.message) {
      alert("Usuario registrado correctamente");
      router.push("/login");
    } else {
      setError(data.error || "Error al registrar");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-xl font-bold mb-4">Registro</h1>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} className="w-full mb-2 p-2 border rounded" />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full mb-2 p-2 border rounded" />
        <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} className="w-full mb-4 p-2 border rounded" />
        <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50">
          {loading ? "Registrando..." : "Registrar"}
        </button>
        <p className="mt-4 text-sm text-center">
          ¿Ya tienes cuenta? <Link href="/login" className="text-blue-500 underline">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}