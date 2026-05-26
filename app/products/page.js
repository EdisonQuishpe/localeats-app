"use client";
import { useState, useEffect } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [editingProduct, setEditingProduct] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const handleCancel = () => {
    setForm({ name: "", description: "", price: "" });
    setEditingProduct(null);
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: String(p.price) });
    setEditingProduct(p.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
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
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: Number(form.price),
      }),
    });

    const data = await res.json();
    alert(data.message || data.error);

    if (!res.ok) return;

    setForm({ name: "", description: "", price: "" });
    setEditingProduct(null);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Productos</h1>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{editingProduct ? "Editar producto" : "Nuevo producto"}</h2>
        {editingProduct && (
          <button type="button" onClick={handleCancel} className="text-sm text-blue-600">
            Cancelar
          </button>
        )}
      </div>
      <form className="bg-gray-50 p-4 rounded mb-6" onSubmit={handleSubmit}>
        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} className="border p-2 mb-2 rounded w-full" />
        <input name="description" placeholder="Descripción" value={form.description} onChange={handleChange} className="border p-2 mb-2 rounded w-full" />
        <input name="price" placeholder="Precio" value={form.price} onChange={handleChange} className="border p-2 mb-3 rounded w-full" />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingProduct ? "Actualizar" : "Crear"}
        </button>
      </form>

      {/* Lista */}
      {products.map((p) => (
        <div key={p.id} className="border p-3 mb-3 rounded">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-bold">{p.name}</h2>
              <p className="text-sm text-gray-600">{p.description}</p>
              <p className="text-green-600">${p.price}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(p)} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">
                Editar
              </button>
              <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}