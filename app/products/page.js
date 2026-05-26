"use client";
import { useState, useEffect } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price) {
      alert("Completa todos los campos");
      return;
    }

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    
    const data = await res.json();
    alert(data.message || data.error);
    setForm({ name: "", description: "", price: "" });
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Productos</h1>
      <form className="bg-gray-50 p-4 rounded mb-6">
        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} className="border p-2 mb-2 rounded w-full" />
        <input name="description" placeholder="Descripción" value={form.description} onChange={handleChange} className="border p-2 mb-2 rounded w-full" />
        <input name="price" placeholder="Precio" value={form.price} onChange={handleChange} className="border p-2 mb-3 rounded w-full" />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Crear</button>
      </form>

      {/* Lista */}
      {products.map((p) => (
        <div key={p.id} className="border p-3 mb-3 rounded">
          <h2 className="font-bold">{p.name}</h2>
          <p className="text-sm text-gray-600">{p.description}</p>
          <p className="text-green-600">${p.price}</p>
        </div>
      ))}
    </div>
  );
}