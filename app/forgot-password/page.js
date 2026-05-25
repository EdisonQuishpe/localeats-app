"use client";

import { useState } from "react";

export default function ForgotPassword() {
  const [form, setForm] = useState({
    email: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    alert(data.message || data.error);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Recuperar contraseña
      </h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={form.email}
          onChange={handleChange}
          className="border p-2 mr-2"
        />

        <input
          type="password"
          name="newPassword"
          placeholder="Nueva contraseña"
          value={form.newPassword}
          onChange={handleChange}
          className="border p-2 mr-2"
        />

        <button className="bg-blue-500 text-white p-2">
          Cambiar contraseña
        </button>
      </form>
    </div>
  );
}