"use client";
export default function Products() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Productos</h1>
      <form className="bg-gray-50 p-4 rounded mb-6">
        <h2 className="font-semibold mb-3">Nuevo producto</h2>
        <input placeholder="Nombre" className="border p-2 mb-2 rounded w-full" />
        <input placeholder="Descripción" className="border p-2 mb-2 rounded w-full" />
        <input placeholder="Precio" className="border p-2 mb-3 rounded w-full" />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Crear</button>
      </form>
      <p className="text-gray-400">Lista de productos aquí...</p>
    </div>
  );
}