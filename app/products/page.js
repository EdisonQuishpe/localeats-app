"use client";

import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
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

  // ➕ Crear producto
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message || data.error);

    // limpiar formulario
    setForm({
      name: "",
      description: "",
      price: "",
    });

    fetchProducts(); // actualizar lista
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>

      {/* Formulario */}
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
          Crear
        </button>
      </form>

      {/* Lista */}
      <div>
        {products.map((p) => (
          <div key={p.id} className="border p-2 mb-2">
            <h2 className="font-bold">{p.name}</h2>
            <p>{p.description}</p>
            <p>${p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}