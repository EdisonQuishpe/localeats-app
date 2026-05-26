"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "" });

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price) {
      alert("Completa todos los campos");
      return;
    }
    const url = editingProduct ? `/api/products/${editingProduct}` : "/api/products";
    const method = editingProduct ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    alert(data.message || data.error);
    setForm({ name: "", description: "", price: "" });
    setEditingProduct(null);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price });
    setEditingProduct(p.id);
  };

  const handleCancel = () => {
    setForm({ name: "", description: "", price: "" });
    setEditingProduct(null);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Link href="/dashboard" className="text-blue-500 underline text-sm">Volver</Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded mb-6">
        <h2 className="font-semibold mb-3">{editingProduct ? "Editar producto" : "Nuevo producto"}</h2>
        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} className="border p-2 mb-2 rounded w-full" />
        <input name="description" placeholder="Descripción" value={form.description} onChange={handleChange} className="border p-2 mb-2 rounded w-full" />
        <input name="price" placeholder="Precio" type="number" value={form.price} onChange={handleChange} className="border p-2 mb-3 rounded w-full" />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {editingProduct ? "Actualizar" : "Crear"}
          </button>
          {editingProduct && (
            <button type="button" onClick={handleCancel} className="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-gray-500">Cargando productos...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No hay productos aún.</p>
      ) : (
        products.map((p) => (
          <div key={p.id} className="border p-3 mb-3 rounded flex justify-between items-start">
            <div>
              <h2 className="font-bold">{p.name}</h2>
              <p className="text-sm text-gray-600">{p.description}</p>
              <p className="text-green-600 font-semibold">${p.price}</p>
            </div>
            <div className="flex gap-2 ml-4">
              <button onClick={() => handleEdit(p)} className="bg-yellow-400 text-white px-3 py-1 rounded text-sm">Editar</button>
              <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Eliminar</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}