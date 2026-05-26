"use client";
import { useState } from "react";

export default function Products() {
  const [form, setForm] = useState({ name: "", description: "", price: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Productos</h1>
      <form className="bg-gray-50 p-4 rounded mb-6">
        <h2 className="font-semibold mb-3">Nuevo producto</h2>
        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} className="border p-2 mb-2 rounded w-full" />
        <input name="description" placeholder="Descripción" value={form.description} onChange={handleChange} className="border p-2 mb-2 rounded w-full" />
        <input name="price" placeholder="Precio" value={form.price} onChange={handleChange} className="border p-2 mb-3 rounded w-full" />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Crear</button>
      </form>
    </div>
  );
}