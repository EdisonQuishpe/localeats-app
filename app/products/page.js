"use client";

import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
  });

  // 🔍 Obtener productos
  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 📝 Manejar inputs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ➕ CREAR o ✏️ EDITAR
  const handleSubmit = async (e) => {
    e.preventDefault();

    let url = "/api/products";
    let method = "POST";

    if (editingProduct) {
      url = `/api/products/${editingProduct}`;
      method = "PUT";
    }

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message || data.error);

    // reset
    setForm({
      name: "",
      description: "",
      price: "",
    });

    setEditingProduct(null);

    fetchProducts();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>

      {/* 🟢 FORMULARIO */}
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
          className="border p-2 mr-2"
        />

        <input
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
          className="border p-2 mr-2"
        />

        <input
          name="price"
          placeholder="Precio"
          value={form.price}
          onChange={handleChange}
          className="border p-2 mr-2"
        />

        <button className="bg-blue-500 text-white p-2">
          {editingProduct ? "Actualizar" : "Crear"}
        </button>
      </form>

      {/* 🟢 LISTA */}
      <div>
        {products.map((p) => (
          <div key={p.id} className="border p-2 mb-2">
            <h2 className="font-bold">{p.name}</h2>
            <p>{p.description}</p>
            <p>${p.price}</p>

            {/* 🗑️ ELIMINAR */}
            <button
              className="bg-red-500 text-white p-1 mr-2"
              onClick={async () => {
                await fetch(`/api/products/${p.id}`, {
                  method: "DELETE",
                });
                fetchProducts();
              }}
            >
              Eliminar
            </button>

            {/* ✏️ EDITAR */}
            <button
              className="bg-yellow-500 text-white p-1"
              onClick={() => {
                setForm({
                  name: p.name,
                  description: p.description,
                  price: p.price,
                });

                setEditingProduct(p.id);
              }}
            >
              Editar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}